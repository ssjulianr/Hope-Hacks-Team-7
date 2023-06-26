// Required Dependencies 
const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2')
const bcrypt = require('bcrypt')

const app = express();
const PORT = 777;


// Necessary Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Database Connection 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'HopeHacks'
});



// Homepage Routing 
app.get('/', (req, res) => {
  res.render('home', { });
});


// Search Page Routing
app.get('/airQuality', (req, res) => {
  const apiKey = '8C403BE0-82C6-46B4-B59C-45FA5929D1E4';
  const zipCode = req.query.zipcode; // Example: set the desired ZIP code

  const url = `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zipCode}&API_KEY=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const airQualityData = {
        aqi: null,
        category: null,
        pollutants: []
      };

      if (data.length > 0) {
        const firstDataPoint = data[0];
        airQualityData.aqi = firstDataPoint.AQI;
        airQualityData.category = firstDataPoint.Category?.Name;
        airQualityData.categoryNumber = firstDataPoint.Category?.Number;

        // Read thev json where you will have the custom message: https://www.geeksforgeeks.org/how-to-read-and-write-json-file-using-node-js/
        // fetch that specfic message from the JSOn and append it to the airQualiy Data

        data.forEach(item => {
          const pollutant = {
            pollutant: item.ParameterName,
            concentration: item.AQI,
            unit: item.Unit,
          };

          airQualityData.pollutants.push(pollutant);
        });
      }
      res.render('airQuality', { airQualityData });
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});


// About Us Routing

app.get('/about', (req, res) => {
  res.render('about')
})

// Login Routing

    // Login GET Route
    app.get('/login', (req, res) => {
      res.render('login');
    });

    // Login POST Route
    app.post('/login', (req, res) => {
      const { username, password } = req.body;

      // Check the database for the user
      connection.query('SELECT * FROM Users WHERE Username = ?', [username], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
          // User not found
          return res.render('login', { error: 'Wrong username or password' });
        }

        const user = results[0];

        // Compare the provided password with the stored encrypted password
        bcrypt.compare(password, user.Password, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error(bcryptErr);
            return res.status(500).send('Internal Server Error');
          }

          if (!bcryptResult) {
            // Passwords don't match
            return res.render('login', { error: 'Wrong username or password' });
          }

          // Successful login
          res.redirect('/admin');
        });
      });
    });



//                              Admin Console Routing

// Dashboard Routing
app.get('/admin', (req, res) => {
  res.render('dashboard');
});

// User Management Routing 

    // User GET Request
    app.get('/admin/users', (req, res) => {
      // Fetch existing users from the database
      connection.query('SELECT * FROM Users', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        res.render('users', { users: results });
      });
    });

    // Add User POST Request
    app.post('/admin/users/add', (req, res) => {
      const { username, password } = req.body;

      // Encrypt the password
      bcrypt.hash(password, 10, (bcryptErr, hash) => {
        if (bcryptErr) {
          console.error(bcryptErr);
          return res.status(500).send('Internal Server Error');
        }

        // Insert the new user into the database
        connection.query('INSERT INTO Users (Username, Password) VALUES (?, ?)', [username, hash], (err) => {
          if (err) {
            console.error(err);
            // Handle the error condition by redirecting back to the add user page with an error query parameter
            return res.redirect('/admin/users?error=true');
          }

          res.redirect('/admin/users');
        });
      });
    });



    // User PUT Request 
    app.route('/admin/users/edit/:id').get((req, res) => {
      const userId = req.params.id;

      // Retrieve user from the database
      connection.query('SELECT * FROM Users WHERE ID = ?', [userId], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
          // User not found
          return res.status(404).send('User not found');
        }

        const user = results[0];

        res.render('editUser', { user });
      });
    })
    .post((req, res) => {
      const userId = req.params.id;
      const { username, password } = req.body;
      const saltRounds = 10;

      // Encrypt the password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        // Update user in the database
        connection.query('UPDATE Users SET Username = ?, Password = ? WHERE ID = ?', [username, hashedPassword, userId], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }

          res.redirect('/admin/users');
        });
      });
    });

    // User DELETE Request
    app.post('/admin/users/delete/:id', (req, res) => {
      const { id } = req.params;

      // Delete the user from the database
      connection.query('DELETE FROM Users WHERE ID = ?', [id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        res.redirect('/admin/users');
      });
    });

app.get('/admin/activity', (req, res) => {
  res.render('activity');
});

app.listen(PORT, () => {
  console.log(`Local Host server is running on Port: ${PORT} `);
});

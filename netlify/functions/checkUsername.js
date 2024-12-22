const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // For hashing passwords

// Set up the MySQL connection pool
const dbConfig = {
  host: 'junction.proxy.rlwy.net', // Database host
  user: 'root', // Replace with your MySQL username
  password: 'wTNLwTJBKJdZXnnptRUyObPaWwazgfJe', // Replace with your MySQL password
  database: 'registerDb', // Database name changed to 'registerDb'
  port: 14963,
};

const pool = mysql.createPool(dbConfig);

// The Lambda function handler
exports.handler = async (event, context) => {
  const { username, password } = JSON.parse(event.body); // Parse the request body to get the username and password

  if (!username || !password) {
    // Basic validation to ensure the required fields are provided
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Username and password are required.' }),
    };
  }

  try {
    // Query the database to check if the username already exists
    const [rows] = await pool.promise().execute('SELECT COUNT(*) AS count FROM users WHERE username = ?', [username]);

    if (rows[0].count > 0) {
      // If username exists, return a response indicating that
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: true }),
      };
    }

    // Username doesn't exist, proceed to hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt rounds of 10

    // Insert the new user into the database
    await pool.promise().execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};



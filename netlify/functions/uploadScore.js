const mysql = require('mysql2');

// Set up the MySQL connection pool
const dbConfig = {
  host: 'junction.proxy.rlwy.net', // e.g., 'railway.app'
  user: 'root', // Replace with your MySQL username
  password: 'wTNLwTJBKJdZXnnptRUyObPaWwazgfJe', // Replace with your MySQL password
  database: 'leaderboard', // Replace with your database name
  port: 14963,
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

exports.handler = async (event, context) => {
  console.log('Attempting to save score to the database...');

  if (event.httpMethod !== 'POST') {
      return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Only POST requests are allowed' }),
      };
  }

  try {
      // Parse the request body
      const { username, score, avgTime, accuracyScore } = JSON.parse(event.body);

      // Construct SQL query for inserting data
      const query = 'INSERT INTO leaderboard (username, score, avg_time, avg_score) VALUES (?, ?, ?, ?)';
      const values = [username, score, avgTime, accuracyScore];

      // Execute the query
      const [result] = await pool.promise().query(query, values);

      console.log('Data saved successfully:', result);

      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Score saved successfully!' }),
      };
  } catch (error) {
      console.error('Error saving score to database:', error);

      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Failed to save score', error: error.message }),
      };
  }
};

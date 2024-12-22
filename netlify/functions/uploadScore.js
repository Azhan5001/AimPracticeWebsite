const mysql = require('mysql2');

// Set up the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.handler = async (event, context) => {
  console.log('Attempting to save score to the database...');

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Only POST requests are allowed' }),
    };
  }

  try {
    // Parse the request body
    const { username, score, avgTime, responseScore } = JSON.parse(event.body);

    // Construct SQL query for inserting data
    const query = 'INSERT INTO leaderboard (username, score, avg_time, avg_score) VALUES (?, ?, ?, ?)';
    const values = [username, score, avgTime, responseScore];

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



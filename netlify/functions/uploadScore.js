const mysql = require('mysql2');

// Set up the MySQL connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });  

exports.handler = async (event, context) => {
  console.log('Attempting to connect to the database...');
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Only POST requests are allowed' }),
    };
  }

  // Parse the request body to get score and avgTime
  const { username, score, avgTime, responseScore } = JSON.parse(event.body);

  // Insert data into the MySQL database
  try {
    const query = 'INSERT INTO leaderboard (username, score, avgTime, responseScore) VALUES (?, ?, ?, ?)';
    const values = [username, score, avgTime, responseScore];

    await pool.promise().query(query, values);
    console.log('Database connected successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score saved successfully!' }),
    };
  } catch (error) {
    console.error('Error saving score:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save score', error }),
    };
  }
};


const mysql = require('mysql2');

// Set up the MySQL connection
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });  

exports.handler = async (event, context) => {
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


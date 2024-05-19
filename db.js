import mysql from 'mysql2';


const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'gresey',
  database: 'StudentAttendance',
});

// Create a promise wrapper around the pool
const db = pool.promise();

export { db };
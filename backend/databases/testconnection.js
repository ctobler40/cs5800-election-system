const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',  
  user: 'root',
  password: 'Could*Wrong*48',
  database: 'election_system'
});
console.log('HELLO HELLO');

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
  db.end();
});

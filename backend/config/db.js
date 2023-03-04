const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "user_auth",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error: " + err.stack);
  } else {
    console.log("Connected to MySQL " + db.threadId);
  }
});

module.exports = db;

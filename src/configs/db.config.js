const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: process.env.DB_IPHOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("DB is connected");
  }
});

module.exports = mysqlConnection;
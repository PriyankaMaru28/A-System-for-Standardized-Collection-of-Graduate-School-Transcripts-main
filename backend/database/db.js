const mysql = require('mysql');
require('dotenv').config();


/**
 * Pool connection created for the 
 * so the server is continuously connected. - Heroku
 */
var pool = mysql.createPool({
  connectionLimit : 100,
  waitForConnections : true,
  queueLimit :0,
  host: process.env.REACT_APP_DB_HOST,
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PASSSWORD,
  database: process.env.REACT_APP_DB_DATABASE,
  debug    :  true,
  wait_timeout : 28800,
  connect_timeout :10
});


module.exports = pool;

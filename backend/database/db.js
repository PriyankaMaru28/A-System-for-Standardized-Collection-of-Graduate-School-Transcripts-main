const mysql = require('mysql');

// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values

// var db_config = {
//   host: 'us-cdbr-east-06.cleardb.net',
//   user: 'bfec5a8020c3c9',
//   password: '07448e55',
//   database: 'heroku_2e92b0443747f43',
// }

// var db_config = {
//   host: '127.0.0.1',
//   user: 'root',
//   password: 'priyanka',
//   database: 'project schema',
// }

// var con;

// function handleDisconnect(){
  
//   con = mysql.createConnection(db_config)
  

// con.connect((err) => {
//   if (err) {
//     console.log(err)
//     console.log('Error connecting to Db');
//     setTimeout(handleDisconnect, 2000);
//     return;
//   }
//   console.log('Database Connection established');
// });

// con.on('error', function(err) {
//   console.log('db error', err);
//   if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
//     handleDisconnect();                        
//   } else {                                      
//     throw err;                                  
//   }
// });

// }

// handleDisconnect()

/**
 * Pool connection created for the 
 * so the server is continuously connected. - Heroku
 */
var pool = mysql.createPool({
  connectionLimit : 100,
  waitForConnections : true,
  queueLimit :0,
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'b200ab438d2977',
  password: '40fa22c2',
  database: 'heroku_4fb5d708e7d5485',
  debug    :  true,
  wait_timeout : 28800,
  connect_timeout :10
});

// Connection for database schema

// const  con = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: 'priyanka',
//   database: 'project schema',

// })

// con.connect((err) =>{
//   if(err){
//       console.log(err)
//     console.log('Error connecting to Db');
//     return;
//   }
//   console.log('Connection established');
// });


module.exports = pool;
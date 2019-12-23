//config.js

//MySql
var mysql = require('mysql');
//Create Connection To Databas
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123qwe!@#',
  database : 'mydb'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection; 




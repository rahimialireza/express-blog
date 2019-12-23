//query.js


// var Cryptr = require('cryptr');
// cryptr = new Cryptr('myTotalySecretKey');

//MySql
var mysql      = require('mysql');
//Create Connection To Databas
var connection2 = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123qwe!@#',
  database : 'mydb'
});

let query=(query,values=undefined)=>new  Promise((resolve,reject)=>{
  connection2.query(query,values,(err,result,field)=>{
    if(err) reject (err)
    else resolve(result)
  })
});

module.exports=query
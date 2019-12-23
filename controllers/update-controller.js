//update-controller.js

//Encryption
var Cryptr = require('cryptr');


//Create Connection To Database
var connection = require('../models/config');

const app=require('express')();

//Session
var session = require('express-session')
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
})); 

module.exports.update=function(req,res){
    var today = new Date().toString();
    var date = today.split(' ').splice(0, 5).join(' ')
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "name":req.body.name,
        "last":req.body.last,
        "major":req.body.major,
        "number":req.body.number,
        "password":encryptedString,
        "updated_at":date,
    }
    connection.query('SELECT * FROM users WHERE email = ?',req.session.user.email, function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'err'
            })
      }else{
        if( results.length > 0){
          connection.query('UPDATE `users` SET `name`=?,`last`=?,`major`=?,`number`=?,`password`=?,`updated_at`=? where `email`=?', [req.body.name,req.body.last,req.body.major,req.body.number, encryptedString, date, req.session.user.email], function (error, results, fields) {
            if (error) {
              res.json({
                  status:false,
                  message:'there are some error with query'
              })
            }else{
              res.redirect('/login');
            }
          });
        }
        else{
            console.log('email is fake');
        }
      }
    });
}

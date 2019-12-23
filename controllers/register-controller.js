//register.js

//Encryption
var Cryptr = require('cryptr');

//var express=require("express");

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

module.exports.register=function(req,res){
    var today = new Date().toString();
    var date = today.split(' ').splice(0, 5).join(' ')
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "name":req.body.name,
        "last":req.body.last,
        "email":req.body.email,
        "password":encryptedString,
        "created_at":date,
        "updated_at":date
    }
    connection.query('SELECT * FROM users WHERE email = ?',req.body.email, function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'err'
            })
      }else{
        if( results.length > 0){
          res.redirect('/register');
        }
        else{
          connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
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
      }
    });
}

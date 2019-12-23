// authenticate-controller.js

//Encryption
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

//Create Connection To Database
var connection = require('../models/config');
module.exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   
   
    connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].password);
            if(password==decryptedString){
                if(results[0].role==0){
                  req.session.user=results[0]
                  res.redirect('/dash-student')
                }
                else if(results[0].role==1){
                  req.session.teacher=results[0]
                  res.redirect('/dash')
                }
            }else{
                res.redirect('/login')
            }
          
        }
        else{
          res.redirect('/login')
        }
      }
    });
}

var express = require('express');
var router = express.Router();
var con = require('../Database/db');
const jwt = require("jsonwebtoken");
const jwtSimple = require('jwt-simple')
const jwt_secret = "munCsSecret";
const crypto = require("crypto");
const {emailsend} = require('../email/email')

function generateToken(user) {
 
  var u = {
   fname: user.fname,
   lname: user.lname,
   id: user.id,
   email: user.email,
   role: user.role
  };
  return token = jwt.sign(u, jwt_secret, {
     expiresIn: 60 * 60 * 2 // expires in 2 hours
  });
}


//checking the authentication for all routes
router.all("/*", function (req, res,next) {
  let NoAuthRequired =
    /^api/.test(req.url.split("/")[1]) || /^auth/.test(req.url.split("/")[1]);
  console.log(NoAuthRequired);
  if (NoAuthRequired) { req.next();} 
  else {
    var tokenn = req.headers['authorization'];
    jwt.verify(tokenn, jwt_secret, (err, user) => {
      if (err) {
        return res.send({ ok: false, action: "Session_Expired" });
      }
      else{
        req.user = user;
        next();
      }
    });
  }
});



router.post('/auth/login', function(req, res, next) {
  const hash = crypto.createHash("sha256");
  let body = req.body;
  /* Check if the user exists in the db using the provided email and password. If password/email incorrect, return errormsg */
  let sql = "select * from user where email = ? and password = ?";
  let pass = hash.update(body.password).digest("base64")
  var values = [body.email, pass];
  con.query(sql, values, function (err, row) {
    if (err) throw err;   

    // Exit if user not found
    if (row.length == 0)
      return res.send({
        ok: false,
        errorMsg: "Email or password is incorrect",
      });

    let userData = JSON.parse(JSON.stringify(row[0]));
    userData ={
      fname: userData.fname,
      lname: userData.lname,
      id: userData.uid,
      email: userData.email,
      role: userData.role
    }
    var token = generateToken(userData);     
    res.send({
      ok:true,
       user: userData,  
       token: token
     });
  });
});


router.post('/auth/register',function(req,res){
  let body = req.body, hash = crypto.createHash("sha256");
  let sql = 'insert into user(email,password,role,fname,lname,studentID) values(?,?,?,?,?,?)';
  let values = [body.email,hash.update(body.password).digest("base64"),'student',body.fname,body.lname,body.sid];
  con.query(sql,values,function(err){
    if(err) throw err;
    res.send({ok:true})
  })
})

router.post('/auth/forgotPassword',function(req,res){
  var email = req.body.email;
  let sql = `select uid,password,fname,lname from user where email=?`;
  con.query(sql, email, function (err, user) {
    if (err) {res.send({ ok: false, errorMsg: "INTERNAL_ERROR" });}
    if (user.length === 0)
      {return res.send({ ok: false, errorMsg: "EMAIL_NOT_FOUND" });}
    let secret = user[0].password + "-" + user[0].fname;
    let payload = {id: user[0].uid}
    var token = jwtSimple.encode(payload,secret)
    var link = "http://localhost:3000/recoverPassword/" +user[0].uid +"/" +token;
    var mailText = 'Hello '+user[0].fname+" "+user[0].lname+',\nPlease click on the link to reset password.\n\n'+link+'\n\nThank you'
      emailsend(email, "Password reset", mailText)
      res.send({ok:true,errorMsg:""})
  })
})


router.get('/auth/resetPassword/:id/:token',function(req,res,next){
  
  let id = req.params.id, token = req.params.token;
    let userdetailsSql = 'select * from user where uid = ?';
    con.query(userdetailsSql,id,function(err,user){
      if(err) throw err;
      let secret = user[0].password + "-" + user[0].fname;
      let payload = jwtSimple.decode(token, secret );
        if(payload.id == user[0].uid){
          res.send({'authenticated':true, id : payload.id})
        }
        else{
          res.send({'authenticated':false ,  id: payload.id})
        }
        
      
      

    })
})

router.post('/auth/resetPassword',function(req,res,next){
  let hash = crypto.createHash("sha256");
  let sql = 'update user set password = ? where uid =? ';
  con.query(sql , [hash.update(req.body.password).digest("base64"), req.body.id],function(err){
    if(err) throw err;
    res.send({ok:true})
})
})

router.post('/updatePassword', function(req,res) {

  var uid = req.user.id ;
  var updatePwdSql = 'update user set password = ? where uid = ?';
  con.query(updatePwdSql,[req.body.password, uid] , function(err){
    if(err) throw err;
    res.send({ok: 'ok'})
  })

})


module.exports = router;

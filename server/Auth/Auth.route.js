const express = require('express');
const authRoutes = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let User = require('../User/User.model');

authRoutes.route('/signup').post(function (req, res) {
  let user = new User(req.body.user)
  user.save()
    .then(() => {
      const token = jwt.sign({ user }, process.env.AUTH_KEY)
      res.status(200).json({token, user});
    })
    .catch(() => {
      res.status(400).send("unable to save user to database");
    });
});

authRoutes.route('/login').post(function (req, res) {
  let user = req.body.user
  if(user){
    User.findOne({ user_id: user.user_id }, function(error, current_user) {
      if(error || !current_user){
        console.log("Error unable to find user: " + user)
        res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
      }
      else {
        console.log(current_user)
        bcrypt.compare(user.password, current_user.password, function(err, result) {
          if(result == true){
            const token = jwt.sign({ current_user }, process.env.AUTH_KEY)
            res.json({token, current_user})
          } else {
            res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
          }
        });
      }
    })
  }else{
    res.status(400).json({ error: 'Invalid login. Please try again.' })
  }
});

authRoutes.route('/check_for_temp_user/:user_id/:temp_password').get(function (req, res) {
  let user_id = req.params.user_id
  let temp_password = req.params.temp_password
  console.log("user_id",user_id,"temp_password",temp_password)
  if(user_id && temp_password){
    User.findOne({ user_id: user_id, temp_password: temp_password}, function(error, temp_user) {
      if(error || !temp_user){
        console.log("Error unable to find temp user with user_id", user_id, "and temp password", temp_password)
        res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
      } else {
        console.log("<Success>: Found temp user")
        res.json(temp_user)
      }
    })
  }else{
    res.status(400).json({ error: 'Invalid login. Please try again.' })
  }
});

authRoutes.route('/set_permanent_pasword').post(function (req, res) {
  let user = req.body.user
  if(user){
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
      if(err || hash == null) {
        console.log("<ERROR> Hashing password for user:",user)
        res.json(err)
      } else {
        User.findByIdAndUpdate(user._id, {
          password: hash,
          temp_password: null
        }, 
        (error, updated_user) => {
          if(error || updated_user == null) {
            console.log("<ERROR> Setting password for user:",user)
            res.json(err)
          } else {
            console.log("<Success> Setting password for user:",updated_user)
            const token = jwt.sign({ updated_user }, process.env.AUTH_KEY)
            let current_user = updated_user
            res.json({token, current_user})
          }
        })
      }
    });
  }else{
    res.status(400).json({ error: 'Invalid user. Please try again.' })
  }
});

module.exports = authRoutes;
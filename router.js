const {BasicStrategy} = require('passport-http');
const express = require('express');
const jsonParser = require('body-parser').json();//why do we need .json() here?
const passport = require('passport');

const {User} = require('./models');

const router = express.Router();

router.use(jsonParser);

router.post('/', (req, res) => {
  if(!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if(!('username' in req.body)) {
    return res.status(422).json({message: "Missing field: username"});
  }


  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }
console.log('user: ' + typeof username);
  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      console.log('return user');
      console.log(username);
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName
        })
    })
    .then(user => {
      console.log("Hello");
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};

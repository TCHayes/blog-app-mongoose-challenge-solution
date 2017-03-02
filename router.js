const {BasicStrategy} = require('passport-http');
const express = require('express');
const jsonParser = require('body-parser').json();//why do we need .json() here?
const passport = require('passport');

const {User} = require('./models');

const router = express.Router();

router.use(jsonParser);

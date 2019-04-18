const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const handleServerError = require('../api-actions').handleServerError;
const Users = require('../users/users-model');

router.post('/register', (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.password ||
    !req.body.lastName ||
    !req.body.username
  ) {
    return res.status(400).json({
      message: 'Improper request',
      example: {
        firstName: 'Barney',
        password: 'YabbaDabbaDo!',
        lastName: 'Rubble',
        username: 'BarnDawgBCE'
      },
      requestProperties: [
        { propertyName: 'firstName', location: 'request body', required: true },
        { propertyName: 'password', location: 'request body', required: true },
        { propertyName: 'lastName', location: 'request body', required: true },
        {
          propertyName: 'username',
          location: 'request body',
          required: true,
          unique: true
        }
      ]
    });
  }

  // hash that password
  const hashedPass = bcrypt.hashSync(req.body.password, 12);

  const hashedUser = {
    favoriteList: [],
    name: {
      first: req.body.firstName,
      last: req.body.lastName
    },
    passHash: hashedPass,
    username: req.body.username
  };

  Users.addUser(hashedUser)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: 'Username already in use.', errorCode: error.code });
      } else {
        handleServerError(error, res);
      }
    });
});

router.post('/login', (req, res) => {
  if (!req.body.password || !req.body.username) {
    return res.status(400).json({
      message: 'Improper request',
      example: {
        password: 'YabbaDabbaDo!',
        username: 'BarnDawgBCE'
      },
      requestProperties: [
        { propertyName: 'password', required: true, location: 'request body' },
        { propertyName: 'username', required: true, location: 'request body' }
      ]
    });
  }

  Users.getByUsername(req.body.username)
    .then(userDoc => {
      if (userDoc && bcrypt.compareSync(req.body.password, userDoc.passHash)) {
        const token = generateToken(userDoc);
        return res.status(200).json({
          message: `Welcome, ${userDoc.name.first} ${userDoc.name.last}!`,
          token: token,
          userID: userDoc._id
        });
      } else {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => handleServerError(error, res));
});

function generateToken(user) {
  const payload = {
    subject: user._id,
    username: user.username
  };
  const options = {
    expiresIn: '11h'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;

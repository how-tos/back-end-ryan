const router = require('express').Router();

const Users = require('./users-model');

const handleServerError = require('../api-actions').handleServerError;

router.get('/', (req, res) => {
  Users.getUsers()
    .then(usersList => {
      res.status(200).json(usersList);
    })
    .catch(error => handleServerError(res, error));
});

router.get('/:id', (req, res) => {
  Users.getUserById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

router.put('/:id', (req, res) => {
  for (let key of Object.keys(req.body)) {
    if (!['firstName', 'password', 'lastName', 'username'].includes(key)) {
      return res.status(400).json({
        message: 'Invalid Request',
        example: {
          firstName: 'Barney',
          lastName: 'Rubble',
          username: 'BarnDawgBCE'
        },
        requestProperties: [
          {
            propertyName: 'firstName',
            required: false,
            location: 'request body'
          },
          { propertyName: 'id', required: true, location: '/api/users/:id' },
          {
            propertyName: 'password',
            required: false,
            location: 'request body'
          },
          {
            propertyName: 'lastName',
            required: false,
            location: 'request body'
          },
          {
            propertyName: 'username',
            required: false,
            location: 'request body'
          }
        ]
      });
    }
  }
  Users.updateUser(req.params.id, req.body)
    .then(result => {
      console.log('updateUser result: ', result);
      if (!result) {
        return res.status(404).json({ message: 'No record found.' });
      }
      return res.status(201).json(result);
    })
    .catch(error => {
      if (error.code == 11000) {
        return res
          .status(400)
          .json({ message: 'Username already in use.', errorCode: error.code });
      } else {
        handleServerError(error, res);
      }
    });
});

router.delete('/:id', (req, res) => {
  Users.deleteUser(req.params.id)
    .then(result => {
      if (!result.n) {
        return res.status(404).json({ message: 'No record found.' });
      }
      res.status(204).end();
    })
    .catch(error => handleServerError(error, res));
});

module.exports = router;

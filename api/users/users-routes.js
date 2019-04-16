const bcrypt = require('bcryptjs');
const router = require('express').Router();

const Users = require('./users-model');

function handleServerError(error, res) {
  console.error(error.message);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

router.post('/', (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.password ||
    !req.body.lastName ||
    !req.body.username
  ) {
    return res.status(400).json({
      message:
        'Please include `firstName`, `password`, `lastName`, and `username` properties.',
      example: {
        firstName: 'Barney',
        password: 'YabbaDabbaDo!',
        lastName: 'Rubble',
        username: 'BarnDawgBCE'
      }
    });
  }

  // hash that password
  const hashedPass = bcrypt.hashSync(req.body.password, 12);

  const hashedUser = {
    name: {
      first: req.body.firstName,
      last: req.body.lastName
    },
    passHash: hashedPass,
    username: req.body.username
  };

  Users.addUser(hashedUser)
    .then(newUser => {
      res.status(200).json(newUser);
    })
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).json({ Error: 'Username already in use.' });
      } else {
        handleServerError(error, res);
      }
    });
});

router.get('/', (req, res) => {
  Users.getUsers()
    .then(usersList => {
      res.status(200).json(usersList);
    })
    .catch(error => handleServerError(res, error));
});

router.get('/drop', (req, res) => {
  Users.dropUsersTable().then(result => {
    res.status(204).end();
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
    .catch(error => handleServerError(res, error));
});

module.exports = router;

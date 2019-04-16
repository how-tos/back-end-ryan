const router = require('express').Router();

const Users = require('./users-model');

function handleServerError(error, res) {
  console.error(error);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

router.post('/', (req, res) => {
  if (
    // @todo make this check more elegant
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
  // @todo: hash that password
  const hashUser = {
    name: {
      first: req.body.firstName,
      last: req.body.lastName
    },
    passHash: req.body.password,
    username: req.body.username
  };
  Users.addUser(hashUser)
    .then(newUser => res.status(200).json(newUser))
    .catch(error => handleServerError(error, res));
});

router.get('/', (req, res) => {
  Users.getUsers()
    .then(usersList => {
      res.status(200).json(usersList);
    })
    .catch(error => handleServerError(res, error));
});

router.delete('/:id', (req, res) => {
  Users.deleteUser(req.params.id)
    .then(result => {
      console.log('delete result: ', result);
      res.status(204).end();
    })
    .catch(error => handleServerError(res, error));
});

module.exports = router;

const router = require('express').Router();

const HowTos = require('./how-to-model');
const stepsRouter = require('../steps/steps-router');

const handleServerError = require('../api-actions').handleServerError;

router.post('/', (req, res) => {
  if (!req.body.authorID || !req.body.title) {
    return res.status(400).json({
      message: 'Invalid Request',
      example: {
        authorID: 'aw357-ahf79fay',
        tags: ['Dinosaurs', 'Mining'],
        title: 'How to Work with Dinosaurs to Mine at the Quarry'
      },
      requestProperties: [
        { propertyName: 'authorID', location: 'request body', required: true },
        { propertyName: 'tags', location: 'request body', required: false },
        { propertyName: 'title', location: 'request body', required: true }
      ]
    });
  }
  const newHowTo = {
    author: req.body.authorID,
    created: Date.now(),
    tags: req.body.tags,
    title: req.body.title
  };
  HowTos.addHowTo(newHowTo)
    .then(savedHowTo => res.status(201).json(savedHowTo))
    .catch(error => {
      if (error.errors.author.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `authorID`.' });
      } else {
        handleServerError(error, res);
      }
    });
});

router.get('/', (req, res) => {
  HowTos.getHowToByFilter()
    .then(list => res.status(200).json(list))
    .catch(error => handleServerError(error, res));
});

router.get('/:howToId', (req, res) => {
  HowTos.getHowToByID(req.params.howToId)
    .then(item => res.status(200).json(item))
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

router.put('/:howToId', (req, res) => {
  for (let key of Object.keys(req.body)) {
    if (!['authorID', 'tags', 'title'].includes(key)) {
      return res.status(400).json({
        message: 'Invalid Request',
        example: {
          authorID: 'aw357-ahf79fay',
          tags: ['Dinosaurs', 'Mining'],
          title: 'How to Work with Dinosaurs to Mine at the Quarry'
        },
        requestProperties: [
          {
            propertyName: 'authorID',
            location: 'request body',
            required: true
          },
          { propertyName: 'tags', location: 'request body', required: false },
          { propertyName: 'title', location: 'request body', required: true }
        ]
      });
    }
  }
  HowTos.editHowTo(req.params.howToId, req.body)
    .then(updatedHowTo => res.status(200).json(updatedHowTo))
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found.' });
      } else if (error.errors.author.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `authorID`.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

router.delete('/:howToId', (req, res) => {
  HowTos.deleteHowto(req.params.howToId).then(result => {
    if (!result.n) {
      return res.status(404).json({ message: 'No record found.' });
    } else {
      return res.status(204).end();
    }
  });
});

router.post('/:howToId/favorite', (req, res) => {
  if (!req.body.hasOwnProperty('isFavorite') || !req.body.userID) {
    return res.status(400).json({
      message: 'Invalid Request',
      example: {
        isFavorite: true,
        userID: 'aw357-ahf79fay'
      },
      requestProperties: [
        {
          propertyName: 'isFavorite',
          location: 'request body',
          required: true
        },
        {
          propertyName: 'how-to ID',
          location: '/api/how-tos/:id',
          required: true
        },
        { propertyName: 'userID', location: 'request body', required: true }
      ]
    });
  }
  HowTos.favoriteHowTo(req.body.userID, req.params.howToId, req.body.isFavorite)
    .then(result => {
      if (result.missing) {
        return result.mising === 'user'
          ? res.status(404).json({ message: 'No record found for user ID' })
          : res.status(404).json({ message: 'No record found for how-to ID' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch(error => handleServerError(error, res));
});

// Forward steps
router.use('/:howToId/steps', stepsRouter);

module.exports = router;

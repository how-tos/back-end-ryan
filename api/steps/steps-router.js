// By using `mergeParams: true` in the `Router()` below,
// The `howToId` is added to the `req` as `req.params.howToId` from the
// `router` that forwarded the request from how-to-routes.js
const router = require('express').Router({ mergeParams: true });

const handleServerError = require('../api-actions').handleServerError;

const Steps = require('./steps-model');

/** Adds a Step to end of Step array */
router.post('/', (req, res) => {
  // Handle Invalid Request //
  if (!req.body.text || !req.body.title) {
    return res.status(400).json({
      message: 'Invalid Request',
      example: {
        image: 'https://www.example.com/image.jpeg',
        text:
          'Stand next to your broomstick, hold out your wand hand, and say, "Up!"',
        title: 'Mount Your Broomstick'
      },
      requestProperties: [
        {
          name: 'How To ID',
          location: '/api/how-to/:howToID/steps',
          required: true
        },
        { name: 'image', location: 'request body', required: false },
        { name: 'text', location: 'request body', required: true },
        { name: 'title', location: 'request body', required: true }
      ]
    });
  }

  // Handle Valid Request //
  let newStep = {
    text: req.body.text,
    title: req.body.title
  };
  if (req.body.image) {
    newStep.image = req.body.image;
  }

  Steps.addStep(req.params.howToId, newStep)
    .then(savedStep => {
      console.log('savedStep: ', savedStep);
      res.status(201).json(savedStep);
    })
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `howToID.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

/** Returns list of Steps for the HowTo ID */
router.get('/', (req, res) => {
  Steps.getSteps(req.params.howToId)
    .then(list => {
      console.log('steps list: ', list);
      res.status(200).json(list);
    })
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `howToID.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

/** Edits a Step */
router.put('/:stepId', (req, res) => {
  // Handle Invalid Request //
  for (let key of Object.keys(req.body)) {
    if (!['image', 'text', 'title'].includes(key)) {
      return res.status(400).json({
        message: 'Invalid Request',
        example: {
          image: 'https://www.example.com/image.jpeg',
          text:
            'Stand next to your broomstick, hold out your wand hand, and say, "Up!"',
          title: 'Mount Your Broomstick'
        },
        requestProperties: [
          {
            name: 'How To ID',
            location: '/api/how-to/:howToID/steps',
            required: true
          },
          { name: 'image', location: 'request body', required: false },
          { name: 'text', location: 'request body', required: false },
          { name: 'title', location: 'request body', required: false }
        ]
      });
    }
  }

  // Handle Valid Request //
  Steps.editStep(req.params.howToId, req.params.stepId, req.body)
    .then(savedStep => {
      if (!savedStep) return res.status(404).json({message: 'No record found for `stepID.'})
      res.status(200).json(savedStep)})
    // @TODO – update error handling below for 404
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `howToID.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

/** Deletes a Step */
router.delete('/:stepId', (req, res) => {
  Steps.deleteStep(req.params.howToId, req.params.stepId)
    .then(stepList => {
      if (!stepList) {
        return res.status(404).json({ message: 'No record found for `stepID`.' });
      } else {
        return res.status(204).end();
      }
    })
    .catch(error => {
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'No record found for `howToID.' });
      } else {
        return handleServerError(error, res);
      }
    });
});

module.exports = router;

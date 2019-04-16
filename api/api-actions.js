module.exports = { handleServerError };

/**
 * Logs error to console and responds to API request with error message
 * @param {error} error thrown error to be sent in reponse
 * @param {*} res Server response to API request
 */
function handleServerError(error, res) {
  console.error(error.message);
  return res
    .status(500)
    .json({ message: 'The request could not be completed.', error: error });
}

const model = require("../models");

/**
 * @function getMovies
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function getMovies(req, res) {
  const query  = req.query;

  if (!query.text) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter: text"
    });

    return;
  }

  try {

    const result = await model.getMovies(req.query);
    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

module.exports = {
  getMovies
};
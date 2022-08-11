const { Router } = require('express');

const authenticate = require('../middleware/authenticate');






module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const listOfPosts = await this.post.getAll();
      res.json(listOfPosts);

    } catch (error) {
      next(error);

    }
  });

const { Router } = require('express');


const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');






module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const listOfPosts = await Post.getAll();
      res.json(listOfPosts);

    } catch (error) {
      next(error);

    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const newPost = await Post.insert(req.body);
      res.json(newPost);
    } catch (error) {
      next (error);
    }
  });

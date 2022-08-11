const { Router } = require('express');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');

const GithubUser  = require('../models/GithubUser');

const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

const authenticate = require('../middleware/authenticate');





module.exports = Router()
  .get('/login', async (req, res) => {

    //start off the github oauth flow

    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })

  .get('/callback', async (req, res, next) => {

    try {

      const { code } = req.query;

      console.log(code);
      const token = await exchangeCodeForToken(code);
      console.log(token);

      const githubProfile = await getGithubProfile(token);

      console.log(githubProfile);

      const user = await GithubUser.insert({
        username: githubProfile.login,
        email: githubProfile.email,
        avatar: githubProfile.avatar_url,
      });
      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      //set cookie and redirect

      res 
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (e) {
      next(e);
    }


  })

  .get('/dashboard', authenticate, async (req, res) => {

    //require req.user
    //get data about user and send it as a json
    res.json(req.user);
  });


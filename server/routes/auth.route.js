const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../controllers/auth.controller');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true,
  }),
  function (req, res) {
    // accessToken을 쿠키에 저장
    res.cookie('id_token', req.user.id_token, { httpOnly: true });
    // 리디렉션

    res.redirect('https://super-squad-delta.vercel.app/home/');
  }
);

router.get('/login', (req, res) => {
  //console.log(req.session.passport.user);
  res.status(200).json({
    message: 'Login successful',
    userInfoId: req.user.id,
    email: req.user.email,
  });
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      message: 'Logout successful',
    });
  });
});

module.exports = router;

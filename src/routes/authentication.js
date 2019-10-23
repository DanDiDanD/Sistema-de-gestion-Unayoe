const express = require('express');
const router = express.Router();
const passport = require('passport');


const {isNotLoggedIn} = require('../lib/auth');

router.get('/signup',isNotLoggedIn, (req, res) => {
     res.render('auth/signup');
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
     successRedirect: '/',
     failureRedirect: '/signup',
     failureFlash: true
}))

router.get('/signin', isNotLoggedIn, (req, res) => {
     res.render('auth/signin');
})


router.post('/signin', isNotLoggedIn,(req, res, next) => {
     passport.authenticate('local.signin', {
          successRedirect: '/',
          failureRedirect: '/signin',
          failureFlash: true
     })(req, res, next);
})

router.get('/logout', isNotLoggedIn, (req, res) => {
     req.logOut();
     res.redirect('/signin');
});

module.exports = router;
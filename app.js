var express = require('express');
var app = express();
var SamlStrategy = require('passport-saml').Strategy;
var passport = require('passport');
var config = require('./config');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://dev-150273.oktapreview.com/app/phongadev412968_oktatestapp_1/exk8olutukb8ox6o30h7/sso/saml',
    issuer: 'https://okta-test-app.herokuapp.com/login/callback',
    cert: config.cert
  },
  function (profile, done) {
    console.log('profile', profile);
    return done(null,
      {
        id: profile.uid,
        email: profile.email,
        displayName: profile.cn,
        firstName: profile.givenName,
        lastName: profile.sn
      });
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/login', passport.authenticate('saml',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

app.post('/login/callback', passport.authenticate('saml',
    {
      failureRedirect: '/',
      failureFlash: true
    }),
  function (req, res) {
    res.redirect('/');
  }
);

app.listen(process.env.PORT || 8080, '0.0.0.0', function () {
  console.log('Example app listening on port 3000!');
});

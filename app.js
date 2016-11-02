var express = require('express');
var app = express();
var SamlStrategy = require('passport-saml').Strategy;
var passport = require('passport');
var config = require('./config');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
var session = require('express-session');

passport.serializeUser(function (user, done) {
  console.log('serialize', user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserialize', user);
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
    return done(null, profile);
  })
);

app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({ secret: "won't tell because it's secret"  }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  res.end(JSON.stringify(req.session.passport.user));
});

app.get('/login', passport.authenticate('saml',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 8080, '0.0.0.0', function () {
  console.log('Example app listening on port 3000!');
});

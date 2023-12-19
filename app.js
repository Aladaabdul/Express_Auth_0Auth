const express = require('express')
const {requireAuth, requiresAuth} = require('express-openid-connect');
const bodyParser = require('body-parser')
require('dotenv').config();

const authMiddleware = require('./auth/auth0');

const PORT = 3000
const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(authMiddleware);

//req.isAuthenticated is provide from the auth router
app.get('/', (req, res) => {
    res.render('index', {
        user: req.oidc.user
    })
})

app.get('/profile', requiresAuth(), (req, res) => {
    console.log(req.oidc.user);
    res.render('profile', {
        user: req.oidc.user
    })
})

app.get('/callback', (req, res) => {
    console.log(req.oidc.user)
    res.redirect('/');
})


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('something broke');
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
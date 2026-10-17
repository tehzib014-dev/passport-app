const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('passportapp', ['users']);
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// LOGIN PAGE - GET
router.get('/login', function (req, res) {
    res.render('login');
});

// REGISTER PAGE - GET
router.get('/register', function (req, res) {
    res.render('register');
});

// REGISTER PAGE - POST
router.post('/register', function (req, res) {
    // Get form values
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    // Form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Please use a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // check for errors
    var errors = req.validationErrors();

    if (errors) {
        console.log('Form has errors...');
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
           var newUser = {
            name: name,
            email: email,
            username: username,
            password: password
        };

        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(newUser.password, salt, function (err, hash){
                newUser.password = hash;
                
                db.users.insert(newUser, function (err, doc) {
                    if (err){
                        res.send(err);
                    } else{
                        console.log('User Registered...');
                        
                        // Success Message
                        req.flash('success', "You are now registered and can log in");  
                        
                        // redirect after registrationcmd
                        res.location('/')
                        res.redirect('/');
                    }
                })
            })
        });
    }
});

passport.serializeUser(function (user, done){
    done(null, user._id);
});

passport.deserializeUser(function (id, done){
    db.users.findOne({_id: mongojs.ObjectId(id)},
    function (err, user){
        done(err, user);
    })
})

passport.use(new LocalStrategy(
    function (username, password, done){
        db.users.findOne({username: username}, 
            function (err, user){
                if (err) {
                    return done(err);
                }
                if (!user){
                    return done(null, false, {message: 'Invalid username or password'});
                }

                bcrypt.compare(password, user.password, function (err, isMatch){
                    if (err){
                        return done(err);
                    }
                    if (isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Invalid username or password'});
                    }
                })
            }
        )
    }
))

// LOGIN PAGE - POST
router.post('/login', 
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: 'Invalid username or password',
            }),
            function (req, res) {
                console.log('Authentication successful...');
                res.redirect('/');
            }
        )

// LOGOUT - GET
router.get('/logout', function (req, res, next){
    req.logout(function (err){
        if (err){
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/users/login');
    });
});

module.exports = router;
const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

module.exports = {
    getUser: (req, res) => {
        res.json({ user: req.user || null });
    },
    postLogin: (req, res, next) => {
        const validationErrors = []
        if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: 'Please enter a valid email address.' })
        if (validator.isEmpty(req.body.password))
            validationErrors.push({ msg: 'Password cannot be blank.' })

        if (validationErrors.length) {
            req.flash('errors', validationErrors)
            return res.json(req.flash())
        }
        req.body.email = validator.normalizeEmail(req.body.email, {
            gmail_remove_dots: false,
        })

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                req.flash('errors', info)
                return res.json(req.flash())
            }
            req.logIn(user, (err) => {
                if (err) { return next(err) }
                // res.redirect('/dashboard')
                req.flash("success", { msg: "Success! You are logged in." });
                res.json({ user, messages: req.flash() });
            })
        })(req, res, next)
    },
    logout: (req, res) => {
        // req.logout()

        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((err) => {
                if (err) console.log('Error : Failed to destroy the session during logout.', err)
                req.user = null
                res.send({ success: true })
            })
        });
    },
    postSignup: async (req, res, next) => {
        const validationErrors = []
        if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
        if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
        if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

        if (validationErrors.length) {
            req.flash('errors', validationErrors)
            return res.json({ messages: req.flash() });
        }
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            gradeLevel: req.body.gradeLevel

        })

        try {
            const checkUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]
            })

            if (checkUser) {
                req.flash('errors', { msg: 'Account with that email address or username already exists.' })
                return res.json({ messages: req.flash() });
            }

            try {
                await user.save()
            } catch (error) {
                return next(error)   
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err)
                }
                res.json({ user, messages: req.flash() });
            })
        } catch (error) {
            return next(err)
        }
    }
}
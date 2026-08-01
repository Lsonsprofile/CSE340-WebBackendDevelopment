// import bcrypt for password hashing
import bcrypt from 'bcrypt';

// import user model functions
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';


// displays the registration form
const showUserRegistrationForm = (req, res) => {

    res.render('register', {
        title: 'Register'
    });

};


// handles registration form submission
const processUserRegistrationForm = async (req, res) => {

    try {

        // get form data
        const { name, email, password } = req.body;


        // create password hash
        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );


        // save user in database
        await createUser(
            name,
            email,
            passwordHash
        );


        // show success message
        req.flash(
            'success',
            'Registration successful! Please log in.'
        );


        // go back to homepage
        res.redirect('/');


    } catch (error) {

        console.error(error);


        // show error message
        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );


        // return to registration page
        res.redirect('/register');

    }

};



// displays the login form
const showLoginForm = (req, res) => {

    res.render('login', {
        title: 'Login'
    });

};



// handles login form submission
const processLoginForm = async (req, res) => {

    try {

        // get login details
        const { email, password } = req.body;


        // check user credentials
        const user = await authenticateUser(
            email,
            password
        );


        // if user exists, create session
        if (user) {

            req.session.user = user;


            req.flash(
                'success',
                'Login successful!'
            );


            // show logged in user in terminal
            console.log(
                'User logged in:',
                user
            );


            // go to dashboard after successful login
            res.redirect('/dashboard');


        } else {

            // wrong email or password
            req.flash(
                'error',
                'Invalid email or password.'
            );


            res.redirect('/login');

        }


    } catch (error) {

        console.error(error);


        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );


        res.redirect('/login');

    }

};



// logs the user out
const processLogout = (req, res) => {

    // remove the logged-in user from the session
    if (req.session.user) {
        delete req.session.user;
    }

    // show success message
    req.flash(
        'success',
        'Logout successful!'
    );

    // return to login page
    res.redirect('/login');

};


// middleware to protect routes
const requireLogin = (req, res, next) => {

    // check if user is logged in
    if (!req.session || !req.session.user) {

        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    // allow the request to continue
    next();

};


// middleware factory to require a specific role
const requireRole = (role) => {

    return (req, res, next) => {

        // check if the user is logged in
        if (!req.session || !req.session.user) {

            req.flash(
                'error',
                'You must be logged in to access this page.'
            );

            return res.redirect('/login');
        }

        // check if the user has the required role
        if (req.session.user.role_name !== role) {

            req.flash(
                'error',
                'You do not have permission to access this page.'
            );

            return res.redirect('/');
        }

        // allow access
        next();

    };

};



// displays the dashboard page
const showDashboard = (req, res) => {

    // get the logged-in user from the session
    const user = req.session.user;

    // render the dashboard page
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });

};

// displays all registered users
const showUsersPage = async (req, res) => {

    // get all users from the database
    const users = await getAllUsers();

    // render the users page
    res.render('users', {
        title: 'Users',
        users
    });

};



// export controller functions
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};
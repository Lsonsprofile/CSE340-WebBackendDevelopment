// Define the controller function for the home page
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// Export it so other files can use it
export { showHomePage };
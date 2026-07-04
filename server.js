// Import the Express framework
import express from 'express';

// Import tools for working with file paths
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current environment (development or production)
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Get the port number from the .env file, or use 3000 if none is provided
const PORT = process.env.PORT || 3000;

// Get the full path of this server.js file
const __filename = fileURLToPath(import.meta.url);

// Get the folder that contains server.js
const __dirname = path.dirname(__filename);

// Create an Express application
const app = express();

// Serve static files (CSS, images, client-side JavaScript) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Tell Express to use EJS as the template engine
app.set('view engine', 'ejs');

// Tell Express where to find the EJS template files
app.set('views', path.join(__dirname, 'src/views'));

// Home page route
app.get('/', (req, res) => {
    const title = 'Home'; 
    res.render('home', { title });
});

// Organizations page route
app.get('/organizations', (req, res) => {
    const title = 'Our Partner Organizations'; 
    res.render('organizations', { title });
});

// Projects page route
app.get('/projects', (req, res) => {
    const title = 'Service Projects'; 
    res.render('projects', { title });
});

// Categories page route
app.get('/categories', (req, res) => {
    const title = 'Categories'; 
    res.render('categories', { title });
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
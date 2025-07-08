const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.post('/api/contact', (req, res) => {
    try {
        const firstName = req.body['first-name'] || req.body.firstName;
        const lastName = req.body['last-name'] || req.body.lastName;
        const { email, message } = req.body;
        
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        console.log('New contact form submission:');
        console.log('Name:', `${firstName} ${lastName}`);
        console.log('Email:', email);
        console.log('Message:', message);
        console.log('----------------------');

        res.json({ 
            success: true, 
            message: 'Thank you for your message!',
            data: { firstName, lastName, email, message }
        });
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process form submission'
        });
    }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    },
    redirect: false
}));

// Handle valid routes
const validRoutes = ['/', '/index.html', '/thankyou.html'];
validRoutes.forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', route === '/' ? 'index.html' : route));
    });
});

// 404 handler - must be after all other routes
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
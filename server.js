const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});


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


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
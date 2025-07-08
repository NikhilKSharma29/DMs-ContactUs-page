const { Handler } = require('@netlify/functions');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const firstName = body['first-name'] || body.firstName;
        const lastName = body['last-name'] || body.lastName;
        const { email, message } = body;
        
        if (!firstName || !lastName || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'All fields are required' 
                })
            };
        }

        console.log('New contact form submission:');
        console.log('Name:', `${firstName} ${lastName}`);
        console.log('Email:', email);
        console.log('Message:', message);
        console.log('----------------------');

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Thank you for your message!',
                data: { firstName, lastName, email, message }
            })
        };
    } catch (error) {
        console.error('Error processing form:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Failed to process form submission'
            })
        };
    }
};

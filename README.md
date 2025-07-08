# Contact Form with Netlify Functions

A simple contact form that uses Netlify Functions for form submission.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npx netlify dev
   ```
   This will start the Netlify development server with function simulation.

## Deployment to Netlify

1. Push your code to a GitHub repository.

2. Go to [Netlify](https://app.netlify.com/) and sign in with your GitHub account.

3. Click on "New site from Git" and select your repository.

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

5. Click "Deploy site" and Netlify will handle the rest!

## Environment Variables

No environment variables are required for basic functionality. If you need to add any in the future, you can set them in the Netlify dashboard under Site settings > Build & deploy > Environment.

## How It Works

- The contact form submits to a Netlify Function at `/.netlify/functions/contact`
- The function processes the form data and returns a response
- Form validation is handled both on the client and server side

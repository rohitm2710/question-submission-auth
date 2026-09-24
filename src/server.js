import app from './app.js';

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`API listening at http://localhost:${port}`);
    });
}
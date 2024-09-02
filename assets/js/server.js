const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch-table', async (req, res) => {
    try {
        const url = 'https://www.kteb.org/lists/pharmacylist/?lang=tr';
        const { data } = await axios.get(url);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Select the table and extract its HTML
        const table = $('table').html();

        // Send the table HTML as the response
        res.send(`
            <html>
                <head>
                    <title>Pharmacy List</title>
                </head>
                <body>
                    <h1>Pharmacy List</h1>
                    <div>${table}</div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching the table:', error);
        res.status(500).send('Error fetching the table');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Playtime Paradise server running')
})

app.listen(port, () => {
    console.log(`Playtime Paradise server is running on port: ${port}`);
})
console.log('hello world');

import express from 'express';
import bodyParser from 'body-parser'

const app = express();
const PORT = 5000

app.use(bodyParser.json());

// create routes

app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM HOMEPAGE');
})

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
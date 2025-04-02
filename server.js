import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CURRENCY = 'usd';

app.use(express.json());
app.use(cors());

let savedCryptos = []; 

// Get the list of all available cryptocurrency prices

app.get('/api/crypto', async (req, res) => {
    try {
        const response = await axios.get(`${CRYPTO_API_URL}?vs_currency=${CURRENCY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch crypto prices' });
    }
});

// Get one cryptocurrency price by name or id
app.get('/api/crypto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${CRYPTO_API_URL}?vs_currency=${CURRENCY}&ids=${id}`);
        res.json(response.data.length ? response.data[0] : { error: 'Crypto not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cryptocurrency details' });
    }
});

// Save a cryptocurrency detail 
app.post('/api/crypto', (req, res) => {
    const crypto = req.body;
    if (!crypto || !crypto.id || !crypto.name || !crypto.current_price) {
        return res.status(400).json({ error: 'Invalid crypto data' });
    }
    savedCryptos.push(crypto);
    res.status(201).json({ message: 'Crypto saved successfully', crypto });
});

// Delete a cryptocurrency detail
app.delete('/api/crypto/:id', (req, res) => {
    const { id } = req.params;
    const index = savedCryptos.findIndex(crypto => crypto.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Crypto not found' });
    }
    savedCryptos.splice(index, 1);
    res.json({ message: 'Crypto deleted successfully' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
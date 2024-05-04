// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/process-order', (req, res) => {
    const { items } = req.body;
    let totalPrice = 0;
    items.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    res.json({ totalPrice });
});

app.get('/order-confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order-confirmation.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

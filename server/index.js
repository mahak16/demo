require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const generatePlan = require('./generatePlan');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
    
app.use(express.json());
app.use(bodyParser.json());

app.post('/server/generatePlan.js', generatePlan);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
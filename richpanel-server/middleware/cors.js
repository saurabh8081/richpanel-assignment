// ifacet/server/middleware/cors.js
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8000'],
  methods: ["GET", "POST"],
  credentials: true
};

module.exports = cors(corsOptions);
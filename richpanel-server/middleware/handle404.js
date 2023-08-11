// ifacet/server/middleware/handle404.js
module.exports = (req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
};

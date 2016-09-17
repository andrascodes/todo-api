module.exports = {
    requireAuthentication: function requireAuthentication(req, res, next) {
        console.log('private route hit!');
        next();
    },
    logger: function logRequest(req, res, next) {
        console.log(`${req.method} ${req.originalUrl}`);
        next();
    }
};
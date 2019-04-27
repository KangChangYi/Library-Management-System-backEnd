function authenticating (req, res, next) {
    console.log("authenticating...");
    next();
}

module.exports = authenticating;
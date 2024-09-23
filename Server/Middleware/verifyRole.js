module.exports = (...roles) => {    
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            return res.status(403).json({ message : "Access denied. Insufficient permissions." })
        }
        next();
    }
}
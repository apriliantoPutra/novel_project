const jwt= require('jsonwebtoken');
const dotenv= require('dotenv');

// verify token
const verifyToken= (req, res, next)=> {
    const authHeader= req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1]; // ambil setelah bearer

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decoded;
        next();
    } catch (error) {
        res.status(403).json({error: 'Invalid or expired token'})
    }
}

// role validation
const verifyRole= (...roles)=> {
    return (req, res, next)=> {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error: 'Access denied: insufficient role.'});
        }
        next();
    }
}
module.exports= {
    verifyToken,
    verifyRole
};

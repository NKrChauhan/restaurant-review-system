const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from authorization header
    if (!token) {
      return res.status(401).send({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = decoded; // Attach decoded user info to request object
    next(); // Continue request processing
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = auth;

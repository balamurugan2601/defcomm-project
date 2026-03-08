const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token and set it as an HTTP-only cookie.
 * @param {Object} res - Express response object
 * @param {string} userId - User's MongoDB ObjectId
 */
const generateToken = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const expiresIn = process.env.JWT_EXPIRE || '30d';

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn,
    });

    return token;
};

module.exports = generateToken;

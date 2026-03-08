const { query } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/adminService');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/HQ
const getStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getSystemStats();
    res.json(stats);
});

// @desc    Get recent message metadata (NO decrypted content)
// @route   GET /api/admin/recent-messages
// @access  Private/HQ
const getRecentMessages = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const messages = await adminService.getRecentMessages(limit);
    res.json(messages);
});

// @desc    Resolve a message threat
// @route   PATCH /api/admin/messages/:id/resolve
// @access  Private/HQ
const resolveMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.resolveMessageThreat(id);
    res.json(result);
});

// Validation rules
const getRecentMessagesValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

// @desc    Get flagged messages (for Alerts Monitor)
// @route   GET /api/admin/flagged-messages
// @access  Private/HQ
const getFlaggedMessages = asyncHandler(async (req, res) => {
    const status = req.query.status || 'all';
    const limit = parseInt(req.query.limit, 10) || 50;
    const messages = await adminService.getFlaggedMessages(status, limit);
    res.json(messages);
});

const getFlaggedMessagesValidation = [
    query('status')
        .optional()
        .isIn(['active', 'resolved', 'all'])
        .withMessage('Status must be active, resolved, or all'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
    getStats,
    getRecentMessages,
    getRecentMessagesValidation,
    resolveMessage,
    getFlaggedMessages,
    getFlaggedMessagesValidation,
};

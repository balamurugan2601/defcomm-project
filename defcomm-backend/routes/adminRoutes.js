const express = require('express');
const router = express.Router();
const {
    getStats,
    getRecentMessages,
    getRecentMessagesValidation,
    resolveMessage,
    getFlaggedMessages,
    getFlaggedMessagesValidation,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// All admin routes require authentication + HQ role
router.use(protect, authorize('hq'));

router.get('/stats', getStats);
router.get('/recent-messages', getRecentMessagesValidation, validate, getRecentMessages);
router.get('/flagged-messages', getFlaggedMessagesValidation, validate, getFlaggedMessages);
router.patch('/messages/:id/resolve', resolveMessage);

module.exports = router;

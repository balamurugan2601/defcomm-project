const { User, Group, Message } = require('../models');

/**
 * Get system statistics for HQ dashboard.
 * Returns counts of users, groups, and messages.
 */
const getSystemStats = async () => {
    const [totalUsers, approvedUsers, pendingUsers, totalGroups, totalMessages] = await Promise.all([
        User.count(),
        User.count({ where: { status: 'approved' } }),
        User.count({ where: { status: 'pending' } }),
        Group.count(),
        Message.count(),
    ]);

    return {
        totalUsers,
        approvedUsers,
        pendingUsers,
        totalGroups,
        totalMessages,
    };
};

/**
 * Get recent message metadata (NO decrypted content).
 * Returns only metadata: senderId, groupId, timestamp.
 * @param {number} limit - Number of recent messages to fetch
 */
const getRecentMessages = async (limit = 10) => {
    const messages = await Message.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'createdAt', 'senderId', 'groupId', 'encryptedText', 'securityStatus'],
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['id', 'username'],
            },
            {
                model: Group,
                as: 'group',
                attributes: ['id', 'name'],
            },
        ],
    });

    return messages.map((msg) => ({
        id: msg.id,
        senderId: msg.sender.id,
        senderName: msg.sender.username,
        groupId: msg.group.id,
        groupName: msg.group.name,
        timestamp: msg.createdAt,
        encryptedText: msg.encryptedText,
        securityStatus: msg.securityStatus,
    }));
};

/**
 * Resolve a triggered threat on a message.
 * @param {number} messageId - ID of the message to resolve
 */
const resolveMessageThreat = async (messageId) => {
    const message = await Message.findByPk(messageId);
    if (!message) {
        throw new Error('Message not found');
    }

    message.securityStatus = 'resolved';
    await message.save();

    return {
        id: message.id,
        securityStatus: message.securityStatus,
    };
};

/**
 * Get flagged messages filtered by security status.
 * @param {string} status - 'active', 'resolved', or 'all'
 * @param {number} limit - Max number of messages to return
 */
const getFlaggedMessages = async (status = 'all', limit = 50) => {
    const where = {};
    if (status === 'active') {
        where.securityStatus = 'active';
    } else if (status === 'resolved') {
        where.securityStatus = 'resolved';
    }

    const messages = await Message.findAll({
        where,
        limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'createdAt', 'senderId', 'groupId', 'encryptedText', 'securityStatus'],
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['id', 'username'],
            },
            {
                model: Group,
                as: 'group',
                attributes: ['id', 'name'],
            },
        ],
    });

    return messages.map((msg) => ({
        id: msg.id,
        senderId: msg.sender.id,
        senderName: msg.sender.username,
        groupId: msg.group.id,
        groupName: msg.group.name,
        timestamp: msg.createdAt,
        encryptedText: msg.encryptedText,
        securityStatus: msg.securityStatus,
    }));
};

module.exports = {
    getSystemStats,
    getRecentMessages,
    resolveMessageThreat,
    getFlaggedMessages,
};

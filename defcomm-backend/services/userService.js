const { User, Message, GroupMember, Group } = require('../models');

/**
 * Get all users with pending approval status.
 */
const getPendingUsers = async () => {
    return User.findAll({
        where: {
            status: 'pending',
            role: 'user',
        },
    });
};

/**
 * Approve a user by ID.
 */
const approveUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    user.status = 'approved';
    await user.save();
    return user;
};

/**
 * Reject a user by ID.
 */
const rejectUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    user.status = 'rejected';
    await user.save();
    return user;
};

/**
 * Update a user by ID.
 */
const updateUser = async (userId, userData) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    return await user.update(userData);
};

/**
 * Delete a user by ID.
 */
const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    // Prevent deletion of HQ admin accounts via the UI
    if (user.role === 'hq') {
        throw new Error('Admin accounts cannot be deleted from the UI. Use the database directly.');
    }

    // Find groups created by this user
    const ownedGroups = await Group.findAll({ where: { createdBy: userId }, attributes: ['id'] });
    const ownedGroupIds = ownedGroups.map(g => g.id);

    // Remove all messages in groups owned by this user
    if (ownedGroupIds.length > 0) {
        await Message.destroy({ where: { groupId: ownedGroupIds } });
        await GroupMember.destroy({ where: { groupId: ownedGroupIds } });
        await Group.destroy({ where: { createdBy: userId } });
    }

    // Remove remaining records tied to this user
    await Message.destroy({ where: { senderId: userId } });
    await GroupMember.destroy({ where: { userId } });

    await user.destroy();
    return true;
};

/**
 * Get all users (for HQ dashboard), excluding passwords.
 */
const getAllUsers = async () => {
    return User.findAll({ where: { role: 'user' } });
};

module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser,
    updateUser,
    deleteUser,
    getAllUsers,
};

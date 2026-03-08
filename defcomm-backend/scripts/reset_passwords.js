const { User } = require('e:/defcomm-project/defcomm-backend/models');
const { sequelize } = require('e:/defcomm-project/defcomm-backend/config/db');
const path = require('path');
const bcrypt = require('bcryptjs');

async function resetPasswords() {
    try {
        const usersToReset = ['user1', 'user2', 'hqadmin'];
        const newPassword = 'Password123!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        for (const username of usersToReset) {
            const user = await User.findOne({ where: { username } });
            if (user) {
                user.password = newPassword; // The hook will hash it
                await user.save();
                console.log(`Password reset for user: ${username}`);
            } else {
                console.log(`User not found: ${username}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error resetting passwords:', error);
        process.exit(1);
    }
}

resetPasswords();

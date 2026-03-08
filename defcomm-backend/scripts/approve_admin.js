const { User } = require('./models');
const { sequelize } = require('./config/db');

async function approveAdmin() {
    try {
        const username = 'admin_test';
        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.error(`User ${username} not found`);
            process.exit(1);
        }

        user.status = 'approved';
        user.role = 'hq'; // Ensure role is hq
        await user.save();

        console.log(`Successfully approved user: ${username} with role: ${user.role}`);
        process.exit(0);
    } catch (error) {
        console.error('Error approving admin:', error);
        process.exit(1);
    }
}

approveAdmin();

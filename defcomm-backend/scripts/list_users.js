const { User, Group, GroupMember } = require('../models');
const { sequelize } = require('../config/db');
require('dotenv').config();

async function listData() {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'status']
        });
        console.log('\n--- Users ---');
        console.table(users.map(u => u.toJSON()));

        const groups = await Group.findAll();
        console.log('\n--- Groups ---');
        console.table(groups.map(g => g.toJSON()));

        const memberships = await GroupMember.findAll();
        console.log('\n--- Memberships ---');
        console.table(memberships.map(m => m.toJSON()));

        process.exit(0);
    } catch (error) {
        console.error('Error listing data:', error);
        process.exit(1);
    }
}

listData();

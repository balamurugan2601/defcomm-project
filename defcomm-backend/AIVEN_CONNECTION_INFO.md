# Aiven MySQL Database Connection Information

## Connection Details

| Property | Value |
|----------|-------|
| **Host** | `mysql-1755cb76-shyamsusi2005-8887.a.aivencloud.com` |
| **Port** | `10324` |
| **Username** | `avnadmin` |
| **Password** | `AVNS_sKdBDu-0n3MjzalP2Wn` |
| **Database** | `defcomm` |
| **SSL Mode** | Required |

## MySQL Workbench Setup

1. Open MySQL Workbench
2. Click the "+" icon to create a new connection
3. Fill in:
   - **Connection Name**: DefComm Aiven DB
   - **Hostname**: `mysql-1755cb76-shyamsusi2005-8887.a.aivencloud.com`
   - **Port**: `10324`
   - **Username**: `avnadmin`
   - **Password**: Click "Store in Vault" and enter `AVNS_sKdBDu-0n3MjzalP2Wn`
   - **Default Schema**: `defcomm`
4. Go to SSL tab and set "Use SSL" to "Require"
5. Test connection and save

## Command Line Access

```bash
mysql -h mysql-1755cb76-shyamsusi2005-8887.a.aivencloud.com -P 10324 -u avnadmin -p defaultdb --ssl-mode=REQUIRED
```

## Database Tables

- `users` - User accounts and authentication
- `groups` - Chat groups/rooms
- `group_members` - Group membership mapping
- `messages` - Chat messages

## Common Queries

```sql
-- View all users
SELECT * FROM users;

-- View all groups
SELECT * FROM `groups`;

-- View group memberships with details
SELECT 
    gm.id,
    u.username,
    g.name as group_name,
    gm.createdAt as joined_at
FROM group_members gm
JOIN users u ON gm.userId = u.id
JOIN `groups` g ON gm.groupId = g.id
ORDER BY g.name, gm.createdAt;

-- Add user to a group
INSERT INTO group_members (userId, groupId, createdAt, updatedAt) 
VALUES (?, ?, NOW(), NOW());
```

## Aiven Console

Access your database management console at:
https://console.aiven.io

---

**⚠️ Security Note**: Keep this file secure and do not commit it to version control!

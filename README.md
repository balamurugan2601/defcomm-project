# DefComm – HQ-Controlled Secure Communication Platform

![Project Status: Active](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Frontend](https://img.shields.io/badge/Frontend-React_18-cyan)
![Backend](https://img.shields.io/badge/Backend-Node.js_|_Express-green)
![Database](https://img.shields.io/badge/Database-MySQL-blue)
![Security](https://img.shields.io/badge/Security-AES--256_|_JWT-red)

**DefComm** is a highly secure, role-based communication platform designed for sensitive operations. It features a robust dual-layer security architecture with client-side message encryption, persistent JWT-based authentication, and a rigorous HQ approval system.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Documentation Directory](#-documentation-directory)

---

## 🌟 Overview

DefComm is built around a centralized Command and Control paradigm:
- **Operatives (`user`)** can communicate securely within assigned groups but cannot access the platform until explicitly approved.
- **Commanders (`hq`)** have full oversight over the system. They manage user approvals, create operational groups, assign members to groups, and monitor system-wide alerts in real-time through an analytical dashboard.

Security is paramount. All message content is encrypted on the client side using AES-256 before it ever touches the network. The backend only stores ciphertext—meaning a database breach would yield zero readable communications.

---

## ✨ Key Features

### 🛡️ Uncompromising Security
- **End-to-End Encryption Scope**: Client-side AES-256 encryption (`crypto-js`); the server stores only `encryptedText`.
- **Persistent Authentication**: HTTP-only, secure JWT cookies prevent XSS theft. Passwords are comprehensively hashed using `bcrypt` (10 salt rounds).
- **Role-Based Access Control (RBAC)**: Strict segregation between `user` and `hq` access levels.

### 👥 Command & Control
- **HQ Approval Pipeline**: New operative registrations default to `pending` status. Only HQ accounts can `approve` or `reject` access.
- **Group-Based Channels**: Isolated communication rooms (`groups`). Operatives only see and decrypt messages for groups they are assigned to. HQ dynamically manages group membership.

### 🚨 Real-time Threat Monitoring
- **Automated Alerts**: The HQ Dashboard actively surfaces messages containing critical keywords (e.g., `URGENT`, `CRITICAL`, `ATTACK`) for immediate action.
- **Analytics**: System-wide statistics (total users, message counts, active groups) available exclusively to HQ.

---

## 🏗️ Architecture & Tech Stack

For deeply technical design decisions, database schemas, and data flow steps, see the **[Architecture Guide](./docs/ARCHITECTURE.md)**.

### **Frontend** (`/defcomm-frontend`)
*React 18, Vite, Context API, Tailwind CSS, crypto-js*
- Client-side routing with `react-router-dom v6`
- Context-based state management (`AuthContext`, `ChatContext`)
- Auto-encrypts outgoing payloads and auto-decrypts incoming data

### **Backend** (`/defcomm-backend`)
*Node.js, Express.js, Sequelize ORM, JWT, express-validator*
- RESTful API structured via routers, controllers, and services
- Advanced middleware layer (`protect`, `authorize`, error mapping)
- Standardized, consistent API JSON response formatting

### **Database** 
*MySQL Server*
- Strictly typed tables (`users`, `groups`, `group_members`, `messages`)
- Robust relational integrity enforced via comprehensive foreign keys and constraints

---

## 📁 Project Structure

```text
e:\DEFCOMM\
├── defcomm-frontend/          # React SPA Frontend
│   ├── src/components/        # Reusable UI elements
│   ├── src/pages/             # Main application views (Dashboard, Chat, Admin)
│   ├── src/context/           # React Context Providers
│   └── src/utils/             # AES encryption/decryption utilities
│
├── defcomm-backend/           # Node.js/Express API Backend
│   ├── config/                # DB connections & environment config
│   ├── models/                # Sequelize schema definitions
│   ├── controllers/           # HTTP request handlers & validation
│   ├── services/              # Core business & database logic
│   ├── middleware/            # Auth gates & error handlers
│   └── routes/                # Express API endpoints mapping
│
├── docs/                       # Project documentation
│   ├── ARCHITECTURE.md        # In-depth system design & DB schema
│   ├── DEPLOYMENT.md          # Production deployment guide
│   ├── INTEGRATION_TESTING_GUIDE.md # API testing workflows
│   └── MANUAL_TESTING_GUIDE.md # UI testing workflows
│
├── scripts/                    # Automation & testing scripts
│   ├── approve-all-hq.ps1      # Bulk user approval script
│   └── test-*.ps1              # PowerShell test suites
│
└── README.md                  # This document
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8.0+) locally installed and running

### 1. Database Setup
Ensure you have a local MySQL instance running. Create the development database:
```sql
CREATE DATABASE defcomm;
```
*(For detailed backend configuration or migrating to Aiven cloud DB, refer to `defcomm-backend/MYSQL_SETUP.md` and `defcomm-backend/AIVEN_MIGRATION_GUIDE.md`)*

### 2. Backend Initialization
```bash
cd defcomm-backend
npm install
# Create a .env file based on .env.example
npm start
```
*The backend server will automatically sync the Sequelize models to MySQL and run on `http://localhost:5000`.*

### 3. Frontend Initialization
```bash
cd defcomm-frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
```
*The React app will be accessible at `http://localhost:5173`.*

---

## 📚 Documentation Directory

The repository contains extensive, modular documentation covering all stages of the software lifecycle:

- 📐 **[Architecture Overview](./docs/ARCHITECTURE.md)**: Deep dive into the cryptographic flow, role authorizations, and database entity relationships.
- 🚢 **[Deployment Guide](./docs/DEPLOYMENT.md)**: Steps to launch the platform in production via Render (Backend), Vercel (Frontend), and Aiven (MySQL).
- 🧪 **[Integration Testing](./docs/INTEGRATION_TESTING_GUIDE.md)**: API scripts and PowerShell commands to rigorously validate JWT handling, middleware security, and endpoints.
- 🧑‍💻 **[Manual Testing](./docs/MANUAL_TESTING_GUIDE.md)**: End-user focused testing guide simulating the exact click-paths for both Operatives and Commanders.
- 🔗 **Backend Internal Docs**: Inside `defcomm-backend/` you will find specific documentation like `AIVEN_MIGRATION_GUIDE.md` and `PRODUCTION_SECRETS.md`.

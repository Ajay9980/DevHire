# 🚀 DevHire Backend

This is the backend API for **DevHire** — a freelancing platform where **clients post tasks** and **developers bid on them**, built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma**. It includes features like authentication, task bidding, file upload, and Razorpay payment simulation.

---

## 📦 Tech Stack

| Tech          | Purpose                      |
|---------------|------------------------------|
| Node.js       | Backend runtime              |
| Express       | REST API framework           |
| PostgreSQL    | Relational database          |
| Prisma ORM    | Database modeling & queries  |
| Multer        | File upload middleware       |
| Cloudinary    | Image/file storage           |
| Razorpay (test) | Payment integration          |
| JWT           | Authentication               |
| Bcrypt        | Password hashing             |
| dotenv        | Environment config           |

---

## 🔐 Roles & Permissions

| Role      | Permissions                               |
|-----------|-------------------------------------------|
| `CLIENT`  | Register, post tasks, accept bids, mark complete |
| `DEVELOPER` | Register, bid on tasks, upload submissions |

---

## 📁 Folder Structure

backend/
├── controllers/ # Logic for routes
├── middleware/ # Auth, role-check, multer config
├── routes/ # Route definitions
├── prisma/ # Prisma schema & migrations
├── utils/ # Cloudinary, Stripe setup
├── uploads/ # Temporary storage (if needed)
├── index.js # Entry point
├── .env # Environment config





COMMANDS TO CREATE DB : - 

npm install prisma 

npm install @prisma/client

npx prisma init

npx prisma migrate dev

npx prisma generate  -: to update the db
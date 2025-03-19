# PostgreSQL + Prisma + Node.js Backend  

## 📌 Overview  
This project is a backend system built using **Node.js, Express, Prisma ORM, and PostgreSQL**, with additional integrations such as **Redis (for caching and queues), Cloudinary (for file uploads), and Nodemailer (for email services)**.  

## 🚀 Features  
- **User Authentication**: Secure login and registration using JWT and bcrypt.  
- **Email Service**: Queued email sending with Nodemailer and BullMQ.  
- **News Management**: CRUD operations for news articles.  
- **Profile Management**: Upload and update user profile pictures via Cloudinary.  
- **Rate Limiting**: API protection using Express Rate Limit.  
- **Logging**: Winston-based logging for error tracking.  

---

## 🛠️ Tech Stack  
- **Backend**: Node.js, Express  
- **Database**: PostgreSQL (via Prisma ORM)  
- **Caching & Queue**: Redis + BullMQ  
- **File Uploads**: Cloudinary  
- **Email Service**: Nodemailer  
- **Security**: Helmet, CORS, Rate Limiting  
- **Logging**: Winston  

---

## 📂 Project Structure  
```
/config
  ├── nodemailer.js       # Email transport config  
  ├── queue.js            # Redis Queue configuration  
  ├── ratelimit.js        # API rate limiting setup  
  ├── redis.config.js     # Redis caching setup  
/controllers  
  ├── Auth.controller.js  # Authentication logic  
  ├── News.controller.js  # News CRUD operations  
  ├── Profile.controller.js # Profile management  
/db  
  ├── index.js            # Prisma client setup  
/jobs  
  ├── EmailQueueJob.js    # Email job processing using BullMQ  
/middlewares  
  ├── auth.middleware.js  # JWT authentication middleware  
/routes  
  ├── api.routes.js       # API routes definition  
/utils  
  ├── cloudinary.js       # Cloudinary image upload functions  
  ├── logger.js           # Winston logger setup  
/validations  
  ├── Auth.validation.js  # Validation schema for auth  
  ├── News.validation.js  # Validation schema for news  
.env.example             # Environment variable template  
index.js                 # Main server entry point  
package.json             # Dependencies and scripts  
```

---

## 🔧 Setup and Installation  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Zenitssuu/postgresSQL-project.git
cd postgresSQL-project
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file in the root directory and fill it with your credentials:  
```
PORT=3000
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_db"
JWT_SECRET="your_secret_key"
REDIS_HOST=localhost
REDIS_PORT=6379
CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
EMAIL_SERVICE=your_email_service
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email
EMAIL_PASS=your_password
EMAIL_FROM=your_from_email
```

### 4️⃣ Set Up PostgreSQL  
Make sure **PostgreSQL** is installed and running. Create a database:  
```sh
psql -U your_user -d postgres
CREATE DATABASE your_db;
```

### 5️⃣ Run Prisma Migrations  
```sh
npx prisma migrate dev --name init
npx prisma generate
```

### 6️⃣ Start Redis (for caching & queues)  
Ensure Redis is running:  
```sh
redis-server
```

### 7️⃣ Start the Server  
```sh
npm run dev
```
The server will run on **http://localhost:3000**  

---

## 📡 API Endpoints  

### 🔐 Authentication  
- `POST /api/auth/register` – User registration  
- `POST /api/auth/login` – User login  

### 📰 News  
- `GET /api/news` – Fetch all news  
- `POST /api/news` – Create a news post (requires auth)  
- `PUT /api/news/:id` – Update a news post (requires auth)  
- `DELETE /api/news/:id` – Delete a news post (requires auth)  

### 📧 Email  
- `GET /api/auth/send-email?email=user@example.com` – Queue an email  

### 🏆 Profile  
- `GET /api/profile` – Get logged-in user profile  
- `PUT /api/profile` – Update profile picture  

---

## 📌 Additional Notes  
- Uses **Prisma ORM** for interacting with PostgreSQL.  
- Implements **Redis caching** for performance optimization.  
- Secure **JWT authentication** for protected routes.  

---

🚀 **Happy Coding!**
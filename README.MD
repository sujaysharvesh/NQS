
# 1. Clone the Repository

```bash
git clone https://github.com/sujaysharvesh/NQS.git
cd NQS
```

---

# 2. Install Dependencies

## Install Root Dependencies

```bash
npm run install-all
```

# 3. Environment Variables

Create a `.env` file inside the `server` folder.

```bash
cd server
```

Create `.env`:

```env
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/angular_app
```

---

# 4. Running the Application

## Start Backend Server

```bash
cd server
npm run start
```

Backend runs on:

```txt
http://localhost:3000
```

---

## Start Frontend Client

Open another terminal:

```bash
npm run start
```

Frontend runs on:

```txt
http://localhost:4200
```

---

# Demo Login Credentials

## Admin Account

```txt
Email: cd@app.com
Password: admin123
```

## General User Account

```txt
Email: bob@app.com
Password: user123
```

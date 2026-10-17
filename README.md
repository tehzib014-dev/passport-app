# Passport Authentication App

## Introduction

A server-rendered user authentication app built with Express and Passport. Users can register, log in, access a protected member page, and log out.

## Technologies

- Node.js
- Express 5
- Passport and Passport Local
- MongoDB via `mongojs`
- EJS templates
- Tailwind CSS (CDN) and custom CSS
- `bcryptjs` for password hashing
- `express-session` and `connect-flash`
- `express-validator` for registration validation

## Project Structure

```text
.
├── app.js                  # Express setup, middleware, and server
├── package.json            # Dependencies and npm scripts
├── package-lock.json       # Locked dependency versions
├── public/
│   └── style.css           # Shared application styles
├── routes/
│   ├── index.js            # Protected member route
│   └── users.js            # Registration, login, and logout routes
└── views/
    ├── index.ejs           # Member page
    ├── login.ejs           # Login form
    ├── register.ejs        # Registration form
    └── includes/
        ├── header.ejs      # Shared header
        └── footer.ejs      # Shared footer
```

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Protected member page; unauthenticated users are redirected to login |
| `GET` | `/users/login` | Login form |
| `POST` | `/users/login` | Authenticate with Passport Local |
| `GET` | `/users/register` | Registration form |
| `POST` | `/users/register` | Validate details, hash the password, and create the user |
| `GET` | `/users/logout` | Log out and redirect to login |

## Setup

Requirements: Node.js, npm, and a MongoDB server running locally.

The app connects to the `passportapp` database and its `users` collection using the default local MongoDB connection.

```bash
npm install
node app.js
```

Open `http://localhost:3000` in a browser. The home route requires an authenticated session; register an account first.

The session secret is currently defined in `app.js`. Replace it with an environment-based secret before deploying the app.
# Fanta

Fanta is a full-stack movie streaming and discovery web app. It provides browsing, search, recommendations, reviews, watchlist, and role-based management for users and admins.

---

## Highlights

- Movie browsing by genre, search, and top-rated lists
- Streaming and detailed movie pages
- User watchlist, history, ratings, and reviews
- Role-based access: User and Admin
- Secure authentication with verification flows

---

## Tech Stack

Frontend
- React (Create React App)
- React Router
- OAuth (Google)
- React Player / React YouTube
- React Toastify / React Modal
- FontAwesome / React Icons

Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Nodemailer
- express-session + cookies
- multer (uploads)
- node-fetch

---

## Project Structure

Fanta/
- BackEnd/              Backend (Express + MongoDB)
  - controllers/
  - middleware/
  - models/
  - routes/
  - utils/
  - index.js
  - package.json
- FrontEnd/             Frontend (React)
  - src/
  - package.json
  - README.md

---

## Core Features

Public
- View top-rated movies
- Browse genres and movie lists
- Search movies
- Movie detail page (cast, director, trailer, images)
- Recommendations and similar movies

User
- Register, login, password reset, email verification
- Manage profile and password
- Watchlist / favorite management
- Watch history
- Ratings and reviews
- Activity tracking

Admin
- Create and update movies
- Create genres
- Manage users (view, update, ban, delete)
- Remove reviews

---

## Environment Variables

Backend (.env)
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- EMAIL_USER=your_email
- EMAIL_PASS=your_email_password
- CLIENT_URL=http://localhost:3000

Frontend (.env)
- REACT_APP_API_BASE_URL=http://localhost:5000
- REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

---

## Run Locally

Backend
cd BackEnd
npm install
npm start

Frontend
cd FrontEnd
npm install
npm start

Frontend runs at http://localhost:3000

---

## API Overview (High-Level)

Public
- Get genres, movies, top-rated lists
- Search and filter
- Movie detail and recommendations

User
- Auth: register, login, verify, forgot/reset
- Profile and password updates
- Watchlist, history, ratings, reviews

Admin
- Movie and genre management
- User management and moderation

---

## Notes

- Frontend uses Create React App and runs on port 3000 by default.
- Backend uses MongoDB with Mongoose models for movies, users, ratings, reviews, and watchlists.

---

## License

This project is for educational purposes.

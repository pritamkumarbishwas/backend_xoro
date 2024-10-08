import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/users/index.routes.js'; // Correct path to index.routes.js
import adminRouter from './routes/admin/index.routes.js'; // Correct path to index.routes.js
// import restaurantRouter from './routes/restaurant/index.routes.js'; // Correct path to index.routes.js

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Mount the user routes at /api/v1
app.use("/api/v1/users", userRouter);


// Mount the user routes at /api/v1
// app.use("/api/v1/restaurant", restaurantRouter);


// Mount the user routes at /api/v1
app.use("/api/v1/admin", adminRouter);

// Example route: http://localhost:8000/api/v1/users/login
export { app };

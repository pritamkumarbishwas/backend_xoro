import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRouter from './routes/index.routes.js'; 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1", taskRouter);

// http://localhost:8000/api/v1/users/tasks


export { app };

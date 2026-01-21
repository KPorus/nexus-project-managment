import { errorMiddleware } from "./middlewares/error.middleware";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/db.config"; //
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import router from "./root.route";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
dotenv.config();

export const app: Application = express();
const port = process.env.PORT ?? 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? true
      : (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          if (origin && allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", router);

app.use(errorMiddleware);

app.get("/", (_req, res) => {
  res.send("<h1>Welcome to task monitor API</h1>");
});

// start the server
const start = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on localhost:${port}/api/v1`);
    });
  } catch (error: unknown) {
    console.error(error);
  }
};

start();
export default app;

import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { authRoutes } from "./routes/auth";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
require("dotenv").config();

const PORT = process.env.PORT;

// Redis client for session-store
const redisClient = createClient({
  username: "default",
  password: "Brt4ekb2iAqv71D1VbTOvik6y1Uns2M3",
  socket: {
    host: "redis-17751.crce179.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 17751,
  },
});
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "socialapp:",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRoutes);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      msg: "You are logged in!",
    });
  } else {
    res.json({
      msg: "You are not logged in!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Strated listening on PORT ${PORT}`);
});

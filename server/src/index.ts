import express from "express";
import session from "express-session";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes";
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome!",
  });
});

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Strated listening on PORT ${PORT}`);
});

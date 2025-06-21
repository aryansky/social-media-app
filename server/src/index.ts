import express from "express";
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome!",
  });
});

app.listen(PORT, () => {
  console.log(`Strated listening on PORT ${PORT}`);
});

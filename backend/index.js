import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import route from "./route.js";
import cors from "cors";
const app = express();
dotenv.config();
const port = process.env.PORT || 8080;

app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(cors());
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
    dbName: "fileUpload",
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/upload", route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

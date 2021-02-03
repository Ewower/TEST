const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
let main = require("./routs/main");
let cashier = require("./routs/cashier");
const auth = require("./routs/auth");
const app = express();

app.use(cookieParser());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", main);
app.use("/cashier", cashier);
app.use("/auth", auth);
app.use(express.static(path.join(__dirname, "public")));
const port = process.env.APP_PORT || 5000;

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://Ewower:Ewower12@cluster0.zymhk.mongodb.net/AstCloud",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    app.listen(port, function () {
      console.log("http://localhost:" + port);
    });
  } catch (e) {
    console.log("Какая та хуета");
  }
}
start();
// Ewower12
// app.listen(process.env.APP_PORT, process.env.APP_IP);

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Utils
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/globalErrorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE_URI.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
// mongoose.set("strictQuery", false);
// mongoose.connect(DB).then(() => {
//   console.log("Database Connected...");
// });

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 5000;

// Routes for pug templates
app.get("/", (req, res) => {
  res.render("emailTemplate", {
    text: "Forgot your password? Submit a new password and confrim password by clicking the button below!",
    name: "Fatahillah",
    url: "#",
  });
});

// Routes
const userRoute = require("./routes/userRoute");

app.use(`/api/v1/users`, userRoute);

// Handle unHandled routes
app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find the routes ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = "fail";

  // next(err);

  next(new AppError(`Can't find the routes ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorController);

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

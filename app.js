const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const militaryLicenseRoutes = require("./routes/militaryLicenseRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
// Serving static files
app.use(express.static(`${__dirname}/build`));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
app.use(
  cors({
    origin: true, // Reflects the request origin
    credentials: true,
  })
);
app.use("/users", userRouter);
app.use("/vehicles", vehicleRoutes);
app.use("/licenses", licenseRoutes);
app.use("/military-licenses", militaryLicenseRoutes);
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

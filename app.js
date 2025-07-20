const express = require("express");
const morgan = require("morgan");
const path = require("path");
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
app.use(express.static(path.join(__dirname, "build")));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));

// API Routes - these must come BEFORE the catch-all
app.use("/api/users", userRouter);           // Consider prefixing with /api
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/military-licenses", militaryLicenseRoutes);

// Catch-all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
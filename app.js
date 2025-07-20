const express = require("express");
const morgan = require("morgan");
const path = require("path"); // Add this import
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
app.use(express.static(path.join(__dirname, "public")));
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

// API Routes
app.use("/users", userRouter);
app.use("/vehicles", vehicleRoutes);
app.use("/licenses", licenseRoutes);
app.use("/military-licenses", militaryLicenseRoutes);

// Serve React App for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// IMPORTANT: Add this catch-all handler for React Router
// This should handle ALL non-API routes and serve the React app
app.get("*", (req, res) => {
  // Check if the request is for an API route
  if (req.originalUrl.startsWith('/users') || 
      req.originalUrl.startsWith('/vehicles') || 
      req.originalUrl.startsWith('/licenses') || 
      req.originalUrl.startsWith('/military-licenses')) {
    // If it's an API route that wasn't matched, let it fall through to the error handler
    return next();
  }
  
  // For all other routes (React Router routes), serve the React app
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handler for unmatched API routes only
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
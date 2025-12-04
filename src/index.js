require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const dht22Routes = require("./routes/dht22.js");
const middlewareLogRequest = require("./middleware/logs.js");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(middlewareLogRequest);

// Routes
app.use("/api/dht22", dht22Routes);

// Root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Smart Room Monitoring API is running 🚀",
    endpoints: {
      dht22: {
        getAll: "GET /api/dht22",
        getByLocation: "GET /api/dht22/:location",
        getLatestDht: "GET /api/dht22/:location/latest",
        create: "POST /api/dht22",
      },
    },
  });
});

// Listen pada semua network interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

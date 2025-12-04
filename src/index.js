// index.js - MODIFIKASI PENUH
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // Tambah
const { Server } = require("socket.io"); // Tambah
const dht22Routes = require("./routes/dht22.js");
const middlewareLogRequest = require("./middleware/logs.js");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(middlewareLogRequest);

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes
app.use("/api/dht22", dht22Routes);

// BUAT HTTP SERVER
const server = http.createServer(app);

// SETUP SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Atur sesuai kebutuhan
    methods: ["GET", "POST"],
  },
});

// Store Socket.io instance globally
global.io = io;

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.emit("connected", {
    message: "Connected to Smart Room Monitoring",
    timestamp: new Date().toISOString(),
  });

  // Handle client events
  socket.on("subscribe", (data) => {
    console.log(`📡 Client ${socket.id} subscribed to sensors`);
    socket.join("sensors");
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Fungsi untuk broadcast data sensor
function broadcastSensorUpdate(sensorData) {
  if (global.io) {
    global.io.emit("sensor_update", {
      type: "sensor_data",
      data: sensorData,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export untuk digunakan di controller
module.exports = {
  broadcastSensorUpdate,
};

// Routes yang sudah ada...
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

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTP Server started on port ${PORT}`);
  console.log(`🔌 WebSocket Server running on ws://localhost:${PORT}`);
});

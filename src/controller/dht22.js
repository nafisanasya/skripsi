const dht22Model = require("../models/dht22");
const { broadcastSensorUpdate } = require("../../index.js"); // Import WebSocket function

const getAllDht = async (req, res) => {
  try {
    const [data] = await dht22Model.getAllDht();
    res.json({
      message: "GET all DHT data success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getDhtByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    const [data] = await dht22Model.getDhtByLocation(location);
    res.json({
      message: `GET DHT ${location} data success`,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getLatestDht = async (req, res) => {
  try {
    const { location } = req.params;
    const [data] = await dht22Model.getLatestByLocation(location);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No data found for location: ${location}`,
        data: null,
      });
    }

    res.json({
      message: `GET latest DHT ${location} data success`,
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const createDht = async (req, res) => {
  const { body } = req;

  // Validasi input
  if (
    !body.location ||
    body.temperature === undefined ||
    body.humidity === undefined
  ) {
    return res.status(400).json({
      message: "Location, temperature, and humidity are required",
    });
  }

  try {
    // Simpan data ke database
    await dht22Model.createDht(body);

    // Broadcast data baru ke WebSocket clients
    try {
      broadcastSensorUpdate({
        location: body.location,
        temperature: body.temperature,
        humidity: body.humidity,
        timestamp: new Date().toISOString(),
      });
      console.log(`✅ WebSocket broadcast for ${body.location} sensor`);
    } catch (wsError) {
      console.warn("⚠️ WebSocket broadcast failed:", wsError.message);
      // Jangan gagalkan response jika WebSocket error
    }

    // Response ke client
    res.json({
      message: "CREATE new DHT data success",
      data: body,
    });
  } catch (error) {
    console.error("❌ Error creating DHT data:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Fungsi untuk broadcast data sensor secara manual (jika diperlukan)
const broadcastSensorData = async (req, res) => {
  try {
    const { location } = req.params;
    const [latestData] = await dht22Model.getLatestByLocation(location);

    if (latestData.length === 0) {
      return res.status(404).json({
        message: `No data found for location: ${location}`,
      });
    }

    broadcastSensorUpdate({
      location: location,
      temperature: latestData[0].temperature,
      humidity: latestData[0].humidity,
      timestamp: new Date().toISOString(),
    });

    res.json({
      message: `Broadcast sensor ${location} data success`,
      data: latestData[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error broadcasting sensor data",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDht,
  getDhtByLocation,
  getLatestDht,
  createDht,
  broadcastSensorData, // Ekspor fungsi broadcast tambahan
};

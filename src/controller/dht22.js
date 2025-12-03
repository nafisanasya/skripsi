const dht22Model = require("../models/dht22");

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
    await dht22Model.createDht(body);
    res.json({
      message: "CREATE new DHT data success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDht,
  getDhtByLocation,
  getLatestDht,
  createDht,
};

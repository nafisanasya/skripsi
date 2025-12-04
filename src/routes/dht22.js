const express = require("express");
const router = express.Router();

const dht22Controller = require("../controller/dht22");

// GET semua data
router.get("/", dht22Controller.getAllDht);

// GET data by lokasi
router.get("/:location", dht22Controller.getDhtByLocation);

// GET latest data by lokasi
router.get("/:location/latest", dht22Controller.getLatestDht);

// POST data baru
router.post("/", dht22Controller.createDht);

// POST broadcast data sensor secara manual
router.post("/:location/broadcast", dht22Controller.broadcastSensorData);

module.exports = router;

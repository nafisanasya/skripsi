const dbPool = require("../config/database");

const getAllDht = () => {
  const sqlQuery = "SELECT * FROM dht22 ORDER BY created_at DESC";
  return dbPool.execute(sqlQuery);
};

const getDhtByLocation = (location) => {
  const sqlQuery =
    "SELECT * FROM dht22 WHERE location = ? ORDER BY created_at DESC";
  return dbPool.execute(sqlQuery, [location]);
};

const getLatestByLocation = (location) => {
  const sqlQuery =
    "SELECT * FROM dht22 WHERE location = ? ORDER BY created_at DESC LIMIT 1";
  return dbPool.execute(sqlQuery, [location]);
};

const createDht = (body) => {
  const sqlQuery =
    "INSERT INTO dht22 (location, temperature, humidity) VALUES (?, ?, ?)";
  const values = [body.location, body.temperature, body.humidity];
  return dbPool.execute(sqlQuery, values);
};

module.exports = {
  getAllDht,
  getDhtByLocation,
  getLatestByLocation,
  createDht,
};

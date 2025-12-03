const logRequest = (req, res, next) => {
  const waktu = new Date().toLocaleString("id-ID");
  console.log(
    `📊 [LOG] ${waktu} - Method: ${req.method}, Endpoint: ${req.path}`
  );
  next();
};

module.exports = logRequest;

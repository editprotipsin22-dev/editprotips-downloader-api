
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "EditProTips Downloader API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "EditProTips Downloader API"
  });
});

app.post("/api/download", (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid video URL"
    });
  }

  res.status(501).json({
    success: false,
    message: "Authorized video provider integration is required."
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

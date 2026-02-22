const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Narrately Backend Running 🚀");
});

app.get("/api/admin/users", async (req, res) => {
  try {
    res.json([
      { id: 1, name: "Admin Test User" }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
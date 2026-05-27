const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const LINE_TOKEN = "u+AYse5mdbL96IM085aMusEiSXbifUrtGXk+x+8R5IBhPoTU+7QI3bS9fVIwjbkHRw6ORzkuboeC8mqmV0X3oWnurua2z8DPp1g85RJTf9GwceBZcoopKypBN+eoSHg/HnyNHFCr80Er75oPQIEv0gdB04t89/1O/w1cDnyilFU=";

app.post("/notify", async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [{ type: "text", text: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${LINE_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("LINE API error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// health check
app.get("/", (req, res) => res.json({ status: "StructSense Backend running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

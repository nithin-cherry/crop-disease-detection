const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Crop Disease API is running",
  });
});







/* ---------------- ANALYZE ROUTE ---------------- */
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    const { language = "en" } = req.body;   // ← New: Accept language

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const langInstruction = language === "te" 
      ? "Respond in **Telugu** language using simple and clear Telugu script."
      : "Respond in **English** language.";

    const prompt = `
You are an expert agricultural AI assistant.

${langInstruction}

Analyze the uploaded crop image and respond **strictly** with only valid JSON in this exact format. 
Do not add any extra text, explanations, or markdown.

{
  "cropName": "Crop name here",
  "disease": "Disease name here",
  "symptoms": "Short description of symptoms",
  "treatment": "Practical treatment advice",
  "prevention": "Key prevention tips"
}

Be accurate, practical, and farmer-friendly.
`;

    const result = await model.generateContent([prompt, imagePart]);
    let responseText = result.response.text().trim();

    responseText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/g, '')
      .trim();

    const analysis = JSON.parse(responseText);

    return res.json({
      success: true,
      data: {
        cropName: analysis.cropName || "Unknown Crop",
        disease: analysis.disease || "Not Detected",
        symptoms: analysis.symptoms || "No symptoms detected.",
        treatment: analysis.treatment || "Consult local agricultural expert.",
        prevention: analysis.prevention || "Follow best farming practices."
      }
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to analyze image. Please try again.",
    });
  }
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
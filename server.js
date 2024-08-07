const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const serviceAccount = require("./serviceAccount.json");

const GEMINI_API_KEY = "AIzaSyCUoSsRDa0Lc1ShhI-DHhyy6OIPRvEuUtA";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ignoreUndefinedProperties: true,
});

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/generate-suggestions", async (req, res) => {
  const { userId } = await req.body;
  // Validate input
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch user data from Firestore
    // const userDoc = await db.collection("users").doc(userId).get();
    // if (!userDoc.exists) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // const userData = userDoc.data();
    // const { major, minor, bio, skills, interests } = userData;

    // // Validate user data
    // if (!major || !minor || !bio || !skills || !interests) {
    //   return res.status(400).json({ error: "Incomplete user data" });
    // }

    // Create prompt based on user data
    //     const prompt = `
    //            {
    //   "prompt": "Given the following student details, suggest project ideas that align with their academic background and interests. Each project idea should be presented as an object with the following keys:",
    //   "details": {
    //     "Major": "${major}",
    //     "Minor": "${minor}",
    //     "Bio": "${bio}",
    //     "Skills": "${skills}",
    //     "Interests": "${interests}"
    //   },
    //   "required_format": [
    //     {
    //       "Project Name": "",
    //       "Description": "",
    //       "How to build the project": ""
    //     }
    //   ]
    // }

    //         `;

    // Generate project suggestions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hey there");
    console.log("i am here o");
    return { result };
    // Log the full result for debugging
    console.log("Full API Response:", result);

    if (
      !result ||
      !result.response ||
      !result.response.candidates ||
      result.response.candidates.length === 0
    ) {
      throw new Error("No candidates returned from generative model");
    }

    const suggestions = result.response.candidates[0].text; // Accessing the first candidate's text

    // Debugging log
    console.log("Generated Suggestions:", suggestions);

    // Save suggestions to Firestore only if suggestions is defined and not empty
    if (suggestions) {
      await db.collection("users").doc(userId).update({ suggestions });
    } else {
      console.log("No suggestions to save.");
    }

    res.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

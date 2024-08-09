import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestore, credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import serviceAccount from "@/serviceAccount.json";
if (!getApps().length) {
  initializeApp({
    credential: credential.cert(serviceAccount),
    ignoreUndefinedProperties: true,
  });
}

export async function POST(req, res) {
  const GEMINI_API_KEY = "AIzaSyCUoSsRDa0Lc1ShhI-DHhyy6OIPRvEuUtA";
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const db = firestore();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const body = await req.json();

  console.log("body", body);

  const userId = body.userId;

  if (!userId) {
    return Response.json({ status: 400, error: "User ID is required" });
  }

  const userDoc = await db.collection("users").doc(userId).get();
  console.log("marker");
  if (!userDoc.exists) {
    return Response.json({ status: 404, error: "User not found" });
  }

  const userData = userDoc.data();
  console.log(userData);
  const { major, minor, bio, skills, interests } = userData;

  // Validate user data
  if (!major || !minor || !bio || !skills || !interests) {
    return Response.json({ status: 400, error: "Incomplete user data" });
  }
  const prompt = `AI assistant is a highly knowledgeable and expert system specializing in suggesting project ideas for students based on their academic and personal profiles.
    The traits of AI include expert knowledge, creativity, accuracy, and detailed analysis. Act as a project advisor that can analyze a student's major, minor, bio, skills, and interests to generate suitable project ideas.
    AI assistant is meticulous and objective, providing clear and structured responses.
    AI assistant is designed to analyze the provided student profile and generate JSON responses that include project names, descriptions, and step-by-step guidance on how to build the projects.
    
    START CONTEXT BLOCK
    Student Profile:
      Major: ${major}
      Minor: ${minor}
      Bio: ${bio}
      Skills: ${skills}
      Interests: ${interests}
    END OF CONTEXT BLOCK
  
    AI assistant will analyze the provided student profile and generate a JSON response with the following structure:
    [
      {
        "Project Name": "string", // The name of the project
        "Description": "string", // A detailed description of the project
        "How to build the project": {
          "Skills": "string", // Skills required to build the project
          "Interests": "string" // Interests related to the project
        }
      }
      // Additional project ideas can follow the same structure
    ]
  
    AI assistant will ensure the JSON response is well-structured, creative, and based strictly on the provided student profile. The response will include detailed project descriptions and guidance on how to build the projects, tailored to the student's skills and interests.
    `;
  const response = await model.generateContent(prompt);
  const result = response.response.candidates[0].content.parts[0].text;

  // console.log(response);
  // return Response.json({
  //   Hello: result,
  // });
  const parsedRes = JSON.parse(result.replace(/```json\n|```/g, ""));
  return Response.json({
    data: parsedRes,
  });
}

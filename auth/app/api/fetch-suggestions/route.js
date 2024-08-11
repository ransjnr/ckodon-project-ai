import { firestore } from "firebase-admin";
import csv from "csv-parser";
import fs from "fs";

export async function POST(req, res) {
  const db = firestore();
  const body = await req.json();
  const { category } = body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  // Reading CSV file and filtering by category
  const results = [];
  fs.createReadStream("./project.csv")
    .pipe(csv())
    .on("data", (data) => {
      if (data.category === category) {
        results.push({
          title: data["Project Title"],
          description: data["Project Description"],
        });
      }
    })
    .on("end", () => {
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ error: "No projects found for this category" });
      }
    });
}

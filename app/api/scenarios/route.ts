import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const mockDataDir = path.join(process.cwd(), "mock_data");

    // Read all json files in mock_data
    const files = fs
      .readdirSync(mockDataDir)
      .filter((file) => file.endsWith(".json"));

    const scenarios = [];

    for (const file of files) {
      const filePath = path.join(mockDataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      if (Array.isArray(data)) {
        scenarios.push(...data);
      }
    }

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Error reading mock data:", error);
    return NextResponse.json(
      { error: "Failed to load scenarios" },
      { status: 500 }
    );
  }
}

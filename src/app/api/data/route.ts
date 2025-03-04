import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public/data.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading data.json:", error);
    return NextResponse.json(
      { error: "Error reading data.json" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing data.json:", error);
    return NextResponse.json(
      { error: "Error writing data.json" },
      { status: 500 }
    );
  }
}

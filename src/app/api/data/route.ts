import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    const client = await clientPromise;
    console.log("MongoDB client connected successfully");

    const db = client.db("gamified_planner");
    console.log("Database selected:", db.databaseName);

    const data = await db.collection("planner").findOne();
    console.log("Data retrieved:", data ? "Found" : "Not found");

    return NextResponse.json(data || {}, { headers: corsHeaders });
  } catch (error: Error | unknown) {
    console.error("Detailed database error:", {
      name: error instanceof Error ? error.name : "Unknown error",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("Attempting to connect to MongoDB for POST...");
    const requestData = await req.json();
    const data = requestData.data || requestData;
    console.log("Received data:", data);

    const client = await clientPromise;
    console.log("MongoDB client connected successfully");

    const db = client.db("gamified_planner");
    console.log("Database selected:", db.databaseName);

    // Create a copy of the data without the _id field
    const { _id, ...dataWithoutId } = data;

    // Check if we already have a document
    const existingDoc = await db.collection("planner").findOne();

    if (existingDoc) {
      // Update existing document
      const result = await db
        .collection("planner")
        .updateOne({ _id: existingDoc._id }, { $set: dataWithoutId });

      console.log("Update result:", result);

      return NextResponse.json(
        {
          success: true,
          modifiedCount: result.modifiedCount,
          upsertedId: existingDoc._id,
        },
        { headers: corsHeaders }
      );
    } else {
      // Insert new document
      const result = await db.collection("planner").insertOne(dataWithoutId);
      console.log("Insert result:", result);

      return NextResponse.json(
        {
          success: true,
          insertedId: result.insertedId,
        },
        { headers: corsHeaders }
      );
    }
  } catch (error: Error | unknown) {
    console.error("Detailed database error:", {
      name: error instanceof Error ? error.name : "Unknown error",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500, headers: corsHeaders }
    );
  }
}

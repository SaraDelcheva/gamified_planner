import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Helper function to handle CORS
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500, headers: corsHeaders() }
      );
    }

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("Connected to MongoDB");

    const db = client.db("gamified_planner");
    console.log("Using database: gamified_planner");

    // Get the data from the "planner" collection with a timeout
    console.log("Fetching data from planner collection...");
    const data = (await Promise.race([
      db.collection("planner").findOne(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 8000)
      ),
    ])) as Record<string, unknown> | null;

    console.log("Data fetched:", data ? "Found" : "Not found");

    if (!data) {
      // If no data exists, create initial data structure
      console.log("Creating initial data structure...");
      const initialData = {
        totalDiamonds: 0,
        totalBlueGems: 0,
        totalPinkGems: 0,
        totalRedGems: 0,
        totalGreenGems: 0,
        goals: [],
        rewards: [],
        habits: [],
        todaysHistory: [],
        notes: [],
      };

      const result = await db.collection("planner").insertOne(initialData);
      console.log("Initial data created with ID:", result.insertedId);

      return NextResponse.json(initialData, { headers: corsHeaders() });
    }

    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error in GET /api/data:", error);
    return NextResponse.json(
      {
        error: "Error reading from database",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500, headers: corsHeaders() }
      );
    }

    console.log("Parsing request body...");
    const { data } = await req.json();
    console.log("Request body parsed");

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("Connected to MongoDB");

    const db = client.db("gamified_planner");
    console.log("Using database: gamified_planner");

    // First, try to find an existing document with a timeout
    console.log("Finding existing document...");
    const existingDoc = (await Promise.race([
      db.collection("planner").findOne(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 8000)
      ),
    ])) as { _id?: ObjectId } | null;

    const documentId = existingDoc?._id || new ObjectId();
    console.log("Using document ID:", documentId);

    // Remove _id from the data if it exists
    const dataToUpdate = { ...data };
    delete dataToUpdate._id;

    console.log("Updating document...");
    const result = (await Promise.race([
      db
        .collection("planner")
        .updateOne(
          { _id: documentId },
          { $set: dataToUpdate },
          { upsert: true }
        ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database update timeout")), 8000)
      ),
    ])) as {
      acknowledged: boolean;
      modifiedCount: number;
      upsertedId?: ObjectId;
    };

    console.log("Update result:", result);

    if (!result.acknowledged) {
      throw new Error("Update operation was not acknowledged");
    }

    return NextResponse.json(
      {
        success: true,
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId,
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error in POST /api/data:", error);
    return NextResponse.json(
      {
        error: "Error writing to database",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500, headers: corsHeaders() }
    );
  }
}

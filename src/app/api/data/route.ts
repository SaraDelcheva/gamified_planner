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

    const client = await clientPromise;
    const db = client.db("gamified_planner");

    // Get the data from the "planner" collection with a timeout
    const data = (await Promise.race([
      db.collection("planner").findOne(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 8000)
      ),
    ])) as Record<string, unknown> | null;

    if (!data) {
      return NextResponse.json(
        { error: "No data found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error reading from MongoDB:", error);
    return NextResponse.json(
      {
        error: "Error reading from database",
        details: error instanceof Error ? error.message : String(error),
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

    const { data } = await req.json();
    const client = await clientPromise;
    const db = client.db("gamified_planner");

    // First, try to find an existing document with a timeout
    const existingDoc = (await Promise.race([
      db.collection("planner").findOne(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 8000)
      ),
    ])) as { _id?: ObjectId } | null;

    const documentId = existingDoc?._id || new ObjectId();

    // Remove _id from the data if it exists
    const dataToUpdate = { ...data };
    delete dataToUpdate._id;

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
    console.error("Error writing to MongoDB:", error);
    return NextResponse.json(
      {
        error: "Error writing to database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders() }
    );
  }
}

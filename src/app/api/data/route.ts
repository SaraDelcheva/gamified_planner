import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

interface MongoError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    const client = await clientPromise;
    console.log("MongoDB connection successful");

    const db = client.db("gamified_planner");
    console.log("Database selected:", "gamified_planner");

    // Get the data from the "planner" collection
    const data = await db.collection("planner").findOne();
    console.log("Query result:", data ? "Data found" : "No data found");

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const mongoError = error as MongoError;
    // Log the full error details
    console.error("Detailed MongoDB error:", {
      name: mongoError?.name,
      message: mongoError?.message,
      stack: mongoError?.stack,
      code: mongoError?.code,
    });

    return NextResponse.json(
      {
        error: "Error reading from database",
        details: mongoError?.message || "Unknown error",
        code: mongoError?.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    const client = await clientPromise;
    const db = client.db("gamified_planner");

    // Remove _id from the data if it exists to prevent immutable field error
    const { _id, ...dataWithoutId } = data;

    // If _id exists, use it to update the document
    if (_id) {
      const result = await db
        .collection("planner")
        .updateOne(
          { _id: new ObjectId(_id) },
          { $set: dataWithoutId },
          { upsert: true }
        );

      return NextResponse.json({
        success: true,
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId || _id,
      });
    } else {
      // If no _id, insert as new document
      const result = await db.collection("planner").insertOne(dataWithoutId);

      return NextResponse.json({
        success: true,
        acknowledged: result.acknowledged,
        insertedId: result.insertedId,
      });
    }
  } catch (error) {
    console.error("Error writing to MongoDB:", error);
    return NextResponse.json(
      { error: "Error writing to database" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("gamified_planner");

    // Get the data from the "planner" collection
    const data = await db.collection("planner").findOne();

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading from MongoDB:", error);
    return NextResponse.json(
      { error: "Error reading from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    const client = await clientPromise;
    const db = client.db("gamified_planner");

    // Update the existing document if it exists
    const documentId = "68271c3c842cc0a98841afb9";

    const result = await db
      .collection("planner")
      .updateOne(
        { _id: new ObjectId(documentId) },
        { $set: data },
        { upsert: true }
      );

    return NextResponse.json({
      success: true,
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId,
    });
  } catch (error) {
    console.error("Error writing to MongoDB:", error);
    return NextResponse.json(
      { error: "Error writing to database" },
      { status: 500 }
    );
  }
}

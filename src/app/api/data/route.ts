import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "MongoDB URI not configured" },
        { status: 500, headers: corsHeaders }
      );
    }

    const client = await clientPromise;
    const db = client.db("gamified_planner");
    const data = await db.collection("planner").findOne();
    return NextResponse.json(data || {}, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const data = requestData.data || requestData;

    const client = await clientPromise;
    const db = client.db("gamified_planner");

    const { _id, ...dataWithoutId } = data;

    if (_id) {
      const objectId = new ObjectId(_id); // ensure it's the correct format
      const result = await db
        .collection("planner")
        .updateOne(
          { _id: objectId },
          { $set: dataWithoutId },
          { upsert: true }
        );

      return NextResponse.json(
        {
          success: true,
          modifiedCount: result.modifiedCount,
          upsertedId: result.upsertedId || objectId,
        },
        { headers: corsHeaders }
      );
    } else {
      const result = await db.collection("planner").insertOne(dataWithoutId);
      return NextResponse.json(
        {
          success: true,
          insertedId: result.insertedId,
        },
        { headers: corsHeaders }
      );
    }
  } catch (error: unknown) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500, headers: corsHeaders }
    );
  }
}

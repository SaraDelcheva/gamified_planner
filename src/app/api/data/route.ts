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

// Debug logging for build time
console.log("API Route Build Info:", {
  nodeEnv: process.env.NODE_ENV,
  hasMongoUri: !!process.env.MONGODB_URI,
  mongoUriLength: process.env.MONGODB_URI?.length,
  buildTime: new Date().toISOString(),
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    // Environment check logging
    console.log("GET Request Environment:", {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      timestamp: new Date().toISOString(),
    });

    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
      console.error("MongoDB URI Missing in Production");
      return NextResponse.json(
        { error: "MongoDB URI not configured" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Connection attempt logging
    console.log("Attempting MongoDB Connection...");
    const client = await clientPromise;
    console.log("MongoDB Client Connected Successfully");

    const db = client.db("gamified_planner");
    console.log("Database Selected:", "gamified_planner");

    const data = await db.collection("planner").findOne();
    console.log("Data Retrieved:", {
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
    });

    return NextResponse.json(data || {}, { headers: corsHeaders });
  } catch (error: unknown) {
    // Detailed error logging
    console.error("GET Error Details:", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("POST Request Started:", {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
    });

    const requestData = await req.json();
    console.log("Request Data Received:", {
      hasData: !!requestData,
      dataKeys: Object.keys(requestData),
    });

    const data = requestData.data || requestData;
    const client = await clientPromise;
    const db = client.db("gamified_planner");

    const { _id, ...dataWithoutId } = data;
    console.log("Processing Data:", {
      hasId: !!_id,
      dataKeys: Object.keys(dataWithoutId),
    });

    if (_id) {
      const objectId = new ObjectId(_id);
      console.log("Updating Document:", { _id: objectId.toString() });

      const result = await db
        .collection("planner")
        .updateOne(
          { _id: objectId },
          { $set: dataWithoutId },
          { upsert: true }
        );

      console.log("Update Result:", {
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId?.toString(),
      });

      return NextResponse.json(
        {
          success: true,
          modifiedCount: result.modifiedCount,
          upsertedId: result.upsertedId || objectId,
        },
        { headers: corsHeaders }
      );
    } else {
      console.log("Inserting New Document");
      const result = await db.collection("planner").insertOne(dataWithoutId);
      console.log("Insert Result:", {
        insertedId: result.insertedId.toString(),
      });

      return NextResponse.json(
        {
          success: true,
          insertedId: result.insertedId,
        },
        { headers: corsHeaders }
      );
    }
  } catch (error: unknown) {
    console.error("POST Error Details:", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json(
      {
        error: "Failed to update data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

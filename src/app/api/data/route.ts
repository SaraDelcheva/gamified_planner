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
    console.log("1. Starting GET request...");
    console.log("2. Checking MongoDB URI:", {
      exists: !!process.env.MONGODB_URI,
      length: process.env.MONGODB_URI?.length,
      hasDatabase: process.env.MONGODB_URI?.includes("/gamified_planner"),
      nodeEnv: process.env.NODE_ENV,
    });

    console.log("3. Attempting MongoDB connection...");
    const client = await clientPromise;
    console.log("4. MongoDB client connected successfully");

    console.log("5. Selecting database...");
    const db = client.db("gamified_planner");
    console.log("6. Database selected successfully");

    console.log("7. Attempting to find data...");
    const data = await db.collection("planner").findOne();
    console.log("8. Data retrieval result:", {
      success: true,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
    });

    return NextResponse.json(data || {}, { headers: corsHeaders });
  } catch (error: unknown) {
    console.error("API Error Details:", {
      step: "Failed during API execution",
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack?.split("\n")[0], // First line of stack trace
            }
          : error,
      mongoUri: {
        exists: !!process.env.MONGODB_URI,
        length: process.env.MONGODB_URI?.length,
        hasDatabase: process.env.MONGODB_URI?.includes("/gamified_planner"),
      },
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
        step: "API execution failed",
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

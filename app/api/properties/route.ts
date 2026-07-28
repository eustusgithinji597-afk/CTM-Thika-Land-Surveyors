import { NextRequest, NextResponse } from "next/server";
import { properties } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const allProperties = await db.select().from(properties);
    return NextResponse.json(allProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      location,
      price,
      imageUrl,
      imageUrls,
      description,
      status,
      amenities,
    } = body;

    const db = await getDb();
    const result = await db
      .insert(properties)
      .values({
        title,
        location,
        price,
        imageUrl,
        imageUrls: imageUrls || [],
        description: description || "",
        status: status || "available",
        amenities: amenities || [],
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    // Serialize known fields from Postgres/Drizzle errors for debugging
    console.error("Error creating property:", error);
    const errObj: any = {};
    if (error instanceof Error) {
      errObj.message = error.message;
      // @ts-ignore
      if (error?.code) errObj.code = error.code;
      // @ts-ignore
      if (error?.detail) errObj.detail = error.detail;
      // @ts-ignore
      if (error?.hint) errObj.hint = error.hint;
    } else {
      errObj.raw = String(error);
    }

    return NextResponse.json(
      { error: "Failed to create property", details: errObj },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      location,
      price,
      imageUrl,
      imageUrls,
      description,
      status,
      amenities,
    } = body;

    const db = await getDb();
    const result = await db
      .update(properties)
      .set({
        title,
        location,
        price,
        imageUrl,
        imageUrls: imageUrls || [],
        description: description || "",
        status,
        amenities,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating property:", error);
    const errObj: any = {};
    if (error instanceof Error) {
      errObj.message = error.message;
      // @ts-ignore
      if (error?.code) errObj.code = error.code;
      // @ts-ignore
      if (error?.detail) errObj.detail = error.detail;
      // @ts-ignore
      if (error?.hint) errObj.hint = error.hint;
    } else {
      errObj.raw = String(error);
    }
    return NextResponse.json(
      { error: "Failed to update property", details: errObj },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    await db.delete(properties).where(eq(properties.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    const errObj: any = {};
    if (error instanceof Error) {
      errObj.message = error.message;
      // @ts-ignore
      if (error?.code) errObj.code = error.code;
      // @ts-ignore
      if (error?.detail) errObj.detail = error.detail;
      // @ts-ignore
      if (error?.hint) errObj.hint = error.hint;
    } else {
      errObj.raw = String(error);
    }
    return NextResponse.json(
      { error: "Failed to delete property", details: errObj },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { leads } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const allLeads = await db.select().from(leads);
    return NextResponse.json(allLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    const errObj: any = {};
    if (error instanceof Error) {
      errObj.message = error.message;
      // @ts-ignore
      if (error?.code) errObj.code = error.code;
      // @ts-ignore
      if (error?.detail) errObj.detail = error.detail;
    } else {
      errObj.raw = String(error);
    }
    return NextResponse.json(
      { error: "Failed to fetch leads", details: errObj },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, serviceType } = body;

    const db = await getDb();
    const result = await db
      .insert(leads)
      .values({
        name,
        phone,
        serviceType,
        status: "new",
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    const errObj: any = {};
    if (error instanceof Error) {
      errObj.message = error.message;
      // @ts-ignore
      if (error?.code) errObj.code = error.code;
      // @ts-ignore
      if (error?.detail) errObj.detail = error.detail;
    } else {
      errObj.raw = String(error);
    }
    return NextResponse.json(
      { error: "Failed to create lead", details: errObj },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const db = await getDb();
    const result = await db
      .update(leads)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }
}

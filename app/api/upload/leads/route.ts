import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "leads";
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function getSupabaseStorageAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseStorageAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase storage credentials are not configured" },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size: 50MB` },
          { status: 400 },
        );
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${timestamp}-${random}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(`leads/${filename}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase leads upload error:", error);
        return NextResponse.json(
          {
            error: "Failed to upload file",
            details: { message: error.message, status: error.status },
          },
          { status: 500 },
        );
      }

      const { data: publicUrl } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`leads/${filename}`);

      uploadedUrls.push(publicUrl.publicUrl);
    }

    if (uploadedUrls.length === 1) {
      return NextResponse.json({ url: uploadedUrls[0] });
    }
    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Leads upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to process upload",
        details: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
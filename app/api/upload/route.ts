import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase credentials are not configured");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

const BUCKET_NAME = "property-images";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
          },
          { status: 400 },
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File too large: ${file.name}. Max size: 50MB`,
          },
          { status: 400 },
        );
      }

      // Generate unique filename with safe extension
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      let extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      // Validate extension against whitelist
      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
      if (!allowedExtensions.includes(extension)) {
        extension = "jpg";
      }
      const filename = `${timestamp}-${random}.${extension}`;

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(`properties/${filename}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        return NextResponse.json(
          {
            error: "Failed to upload file",
            details: {
              message: error.message,
              status: error.status,
            },
          },
          { status: 500 },
        );
      }

      // Get public URL
      const { data: publicUrl } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`properties/${filename}`);

      uploadedUrls.push(publicUrl.publicUrl);
    }

    // Return single URL if one file, array if multiple
    if (uploadedUrls.length === 1) {
      return NextResponse.json({ url: uploadedUrls[0] });
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
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

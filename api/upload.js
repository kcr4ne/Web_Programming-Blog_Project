import { put } from "@vercel/blob";
import sharp from "sharp";

// Helper to get raw body from request stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

export default async function upload(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res
      .status(400)
      .json({ message: "Missing filename query parameter" });
  }

  // IMPORTANT: In a real-world application, you must secure this endpoint.

  try {
    const buffer = await getRawBody(req);

    if (buffer.length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const isGif = filename.toLowerCase().endsWith(".gif");
    const originalFilename = filename.substring(0, filename.lastIndexOf("."));

    let processedBuffer;
    let uniqueFilename;
    let contentType;

    if (isGif) {
      // For GIFs, pass the buffer directly without format conversion
      processedBuffer = buffer;
      uniqueFilename = `${Date.now()}-${originalFilename}.gif`;
      contentType = "image/gif";
    } else {
      // For other formats, convert to WEBP
      processedBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      uniqueFilename = `${Date.now()}-${originalFilename}.webp`;
      contentType = "image/webp";
    }

    // Upload the processed buffer to Vercel Blob
    const blob = await put(uniqueFilename, processedBuffer, {
      access: "public",
      contentType: contentType,
    });

    // Use the `res` object to send the JSON response.
    return res.status(200).json(blob);
  } catch (error) {
    // Check if the error is the specific "already exists" error.
    if (error.message.includes("This blob already exists")) {
      return res.status(409).json({
        message:
          "A file with this name already exists. Please rename the file and try again.",
        error: error.message,
      });
    }
    console.error("Error in upload handler:", error);
    return res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
}

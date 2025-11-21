import { put } from "@vercel/blob";
import sharp from "sharp";

export default async function upload(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res
      .status(400)
      .json({ message: "Missing filename query parameter" });
  }

  // IMPORTANT: In a real-world application, you must secure this endpoint.

  try {
    const isGif = filename.toLowerCase().endsWith(".gif");
    const originalFilename = filename.substring(0, filename.lastIndexOf("."));

    let sharpTransformer;
    let uniqueFilename;
    let contentType;

    if (isGif) {
      // Set up a sharp transformer for GIF
      sharpTransformer = sharp({ animated: true }).gif();
      uniqueFilename = `${Date.now()}-${originalFilename}.gif`;
      contentType = "image/gif";
    } else {
      // Set up a sharp transformer for WEBP
      sharpTransformer = sharp().webp({ quality: 80 });
      uniqueFilename = `${Date.now()}-${originalFilename}.webp`;
      contentType = "image/webp";
    }

    // Pipe the request stream through the sharp transformer
    const processingStream = req.pipe(sharpTransformer);

    // Upload the processed stream to Vercel Blob
    const blob = await put(uniqueFilename, processingStream, {
      access: "public",
      contentType: contentType, // Set the correct content type
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
    console.error("Error uploading to Vercel Blob:", error);
    return res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
}

import { put } from '@vercel/blob';

export default async function upload(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Missing filename query parameter' });
  }

  // IMPORTANT: In a real-world application, you must secure this endpoint.
  // This example allows any unauthenticated user to upload files.
  // You should verify the user's identity here (e.g., by checking a
  // Firebase Auth token passed in the request headers) before proceeding.

  try {
    // Generate a unique filename to prevent overwrites
    const uniqueFilename = `${Date.now()}-${filename}`;

    // The `req` object itself is a readable stream in the Node.js runtime.
    // We can pass it directly to the `put` function's body.
    const blob = await put(uniqueFilename, req, {
      access: 'public',
    });

    // Use the `res` object to send the JSON response.
    return res.status(200).json(blob);
  } catch (error) {
    // Check if the error is the specific "already exists" error.
    // Note: This is a fallback. The unique filename should prevent this.
    if (error.message.includes('This blob already exists')) {
      return res.status(409).json({ message: 'A file with this name already exists. Please rename the file and try again.', error: error.message });
    }
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}

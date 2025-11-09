import { put } from '@vercel/blob';

export default async function upload(req, res) {
  // In the Node.js runtime, query parameters are on the `req.query` object.
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Missing filename query parameter' });
  }

  // IMPORTANT: In a real-world application, you must secure this endpoint.
  // This example allows any unauthenticated user to upload files.
  // You should verify the user's identity here (e.g., by checking a
  // Firebase Auth token passed in the request headers) before proceeding.

  try {
    // The `req` object itself is a readable stream in the Node.js runtime.
    // We can pass it directly to the `put` function's body.
    const blob = await put(filename, req, {
      access: 'public',
    });

    // Use the `res` object to send the JSON response.
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}
import { put } from '@vercel/blob';

export default async function upload(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename || !req.body) {
    return new Response(JSON.stringify({ message: 'Missing filename or file body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // IMPORTANT: In a real-world application, you must secure this endpoint.
  // This example allows any unauthenticated user to upload files.
  // You should verify the user's identity here (e.g., by checking a
  // Firebase Auth token passed in the request headers) before proceeding.

  try {
    const blob = await put(filename, req.body, {
      access: 'public',
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return new Response(JSON.stringify({ message: 'Error uploading file', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { put } from "@vercel/blob";

export async function uploadBufferToBlob(buffer, filename, contentType) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN env var");
  }

  const { url } = await put(filename, buffer, {
    access: "public",
    contentType: contentType || "application/octet-stream",
    token,
  });
  return url;
}



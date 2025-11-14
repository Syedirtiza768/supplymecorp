import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'flipbook');
  let files = [];
  try {
    files = fs.readdirSync(imagesDir)
      .filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/i));
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not read images directory.' }), { status: 500 });
  }
  return new Response(JSON.stringify(files), { status: 200 });
}

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_FILE = join(process.cwd(), 'hotels.json');

function readHotels() {
  if (!existsSync(DB_FILE)) return [];
  try {
    const data = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function writeHotels(hotels) {
  writeFileSync(DB_FILE, JSON.stringify(hotels, null, 2), 'utf-8');
}

export async function GET() {
  const hotels = readHotels();
  return Response.json(hotels);
}

export async function POST(request) {
  const { hotels } = await request.json();
  writeHotels(hotels);
  return Response.json({ success: true });
}

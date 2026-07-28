import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_FILE = join(process.cwd(), 'trips.json');

function readTrips() {
  if (!existsSync(DB_FILE)) return [];
  try {
    const data = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function writeTrips(trips) {
  writeFileSync(DB_FILE, JSON.stringify(trips, null, 2), 'utf-8');
}

export async function GET() {
  const trips = readTrips();
  return Response.json(trips);
}

export async function POST(request) {
  const { trips } = await request.json();
  writeTrips(trips);
  return Response.json({ success: true });
}

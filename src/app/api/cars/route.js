import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_FILE = join(process.cwd(), 'cars.json');

function readCars() {
  if (!existsSync(DB_FILE)) return [];
  try {
    const data = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function writeCars(cars) {
  writeFileSync(DB_FILE, JSON.stringify(cars, null, 2), 'utf-8');
}

export async function GET() {
  const cars = readCars();
  return Response.json(cars);
}

export async function POST(request) {
  const { cars } = await request.json();
  writeCars(cars);
  return Response.json({ success: true });
}

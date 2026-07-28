import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_FILE = join(process.cwd(), 'countries.json');

function readCountries() {
  if (!existsSync(DB_FILE)) return [];
  try {
    const data = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function writeCountries(countries) {
  writeFileSync(DB_FILE, JSON.stringify(countries, null, 2), 'utf-8');
}

export async function GET() {
  const countries = readCountries();
  return Response.json(countries);
}

export async function POST(request) {
  const { countries } = await request.json();
  writeCountries(countries);
  return Response.json({ success: true });
}

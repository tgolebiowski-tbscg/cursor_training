import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// In-memory storage for demo purposes (replace with database in next stage)
let apiKeys = [
  {
    id: '1',
    name: 'default',
    key: 'tvly-********************************',
    fullKey: 'tvly-' + Array(32).fill('0123456789abcdef').map(x => x[Math.floor(Math.random() * x.length)]).join(''),
    createdAt: new Date().toISOString(),
    usage: 24,
  },
];

// Schema for API key creation/update
const apiKeySchema = z.object({
  name: z.string().min(1),
  limit: z.number().optional(),
});

// GET /api/keys - Get all API keys
export async function GET() {
  // Return masked keys (without fullKey)
  const maskedKeys = apiKeys.map(({ fullKey, ...key }) => key);
  return NextResponse.json(maskedKeys);
}

// POST /api/keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, limit } = apiKeySchema.parse(body);
    
    // Generate a new API key
    const id = crypto.randomUUID();
    const fullKey = 'tvly-' + Array(32).fill('0123456789abcdef').map(x => x[Math.floor(Math.random() * x.length)]).join('');
    
    const newKey = {
      id,
      name,
      key: 'tvly-********************************',
      fullKey,
      createdAt: new Date().toISOString(),
      usage: 0,
      limit,
    };
    
    apiKeys.push(newKey);
    
    // Return the new key with the full key for initial display
    return NextResponse.json({ ...newKey, key: fullKey }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
} 
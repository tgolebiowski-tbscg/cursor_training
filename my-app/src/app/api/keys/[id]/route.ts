import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Reference to the in-memory storage (replace with database in next stage)
// This is just for demo purposes
declare global {
  var apiKeys: any[];
}

if (!global.apiKeys) {
  global.apiKeys = [
    {
      id: '1',
      name: 'default',
      key: 'tvly-********************************',
      fullKey: 'tvly-' + Array(32).fill('0123456789abcdef').map(x => x[Math.floor(Math.random() * x.length)]).join(''),
      createdAt: new Date().toISOString(),
      usage: 24,
    },
  ];
}

// Schema for API key update
const apiKeyUpdateSchema = z.object({
  name: z.string().min(1),
  limit: z.number().optional(),
});

// GET /api/keys/[id] - Get a specific API key (with full key)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = global.apiKeys.find(k => k.id === params.id);
  
  if (!key) {
    return NextResponse.json({ error: 'API key not found' }, { status: 404 });
  }
  
  // Return the key with the full key revealed
  return NextResponse.json({ ...key, key: key.fullKey });
}

// PUT /api/keys/[id] - Update an API key
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, limit } = apiKeyUpdateSchema.parse(body);
    
    const keyIndex = global.apiKeys.findIndex(k => k.id === params.id);
    
    if (keyIndex === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    
    // Update the key
    global.apiKeys[keyIndex] = {
      ...global.apiKeys[keyIndex],
      name,
      limit,
    };
    
    // Return the updated key (without fullKey)
    const { fullKey, ...updatedKey } = global.apiKeys[keyIndex];
    return NextResponse.json(updatedKey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

// DELETE /api/keys/[id] - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const keyIndex = global.apiKeys.findIndex(k => k.id === params.id);
  
  if (keyIndex === -1) {
    return NextResponse.json({ error: 'API key not found' }, { status: 404 });
  }
  
  // Remove the key
  global.apiKeys.splice(keyIndex, 1);
  
  return new NextResponse(null, { status: 204 });
} 
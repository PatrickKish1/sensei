import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id') || process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey || !agentId) {
      return NextResponse.json(
        { error: 'Missing ELEVENLABS_API_KEY or agent_id parameter' },
        { status: 500 }
      );
    }

    const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`;
    const response = await fetch(url, {
      headers: {
        'xi-api-key': apiKey,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('ElevenLabs API error:', response.status, text);
      return NextResponse.json(
        { error: `Failed to get signed URL: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error: any) {
    console.error('Error fetching signed URL:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get signed URL' },
      { status: 500 }
    );
  }
}



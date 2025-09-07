import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs Voices API error:', response.status, errorText);
      return NextResponse.json(
        { error: `ElevenLabs Voices API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

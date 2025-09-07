import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { voiceId, text, modelId, voiceSettings, outputFormat } = await request.json();

    if (!voiceId || !text) {
      return NextResponse.json(
        { error: 'voiceId and text are required' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId || 'eleven_multilingual_v2',
        voice_settings: voiceSettings || {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
        output_format: outputFormat || 'mp3_44100_128',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS API error:', response.status, errorText);
      return NextResponse.json(
        { error: `ElevenLabs TTS API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      audio: base64Audio,
      format: outputFormat || 'mp3_44100_128',
    });
  } catch (error: any) {
    console.error('Error in text-to-speech:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to convert text to speech' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const modelId = formData.get('model_id') as string;
    const languageCode = formData.get('language_code') as string;
    const diarize = formData.get('diarize') === 'true';
    const tagAudioEvents = formData.get('tag_audio_events') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const sttFormData = new FormData();
    sttFormData.append('file', file);
    sttFormData.append('model_id', modelId || 'scribe_v1');
    
    if (languageCode) {
      sttFormData.append('language_code', languageCode);
    }
    if (diarize) {
      sttFormData.append('diarize', 'true');
    }
    if (tagAudioEvents) {
      sttFormData.append('tag_audio_events', 'true');
    }

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: sttFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs STT API error:', response.status, errorText);
      return NextResponse.json(
        { error: `ElevenLabs STT API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in speech-to-text:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to convert speech to text' },
      { status: 500 }
    );
  }
}

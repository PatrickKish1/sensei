'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VoiceSettings } from '@/core/services/ElevenLabsService';
import { Settings, Volume2, Mic, Zap } from 'lucide-react';

interface VoiceSettingsProps {
  voiceId: string;
  onSettingsChange?: (settings: VoiceSettings) => void;
  className?: string;
}

export function VoiceSettingsComponent({
  voiceId,
  onSettingsChange,
  className = '',
}: VoiceSettingsProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: keyof VoiceSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings: VoiceSettings = {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.0,
      use_speaker_boost: true,
    };
    setSettings(defaultSettings);
    onSettingsChange?.(defaultSettings);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span>Voice Settings</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Voice Settings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </Button>
          </div>

          <div className="space-y-6">
            {/* Stability */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Stability
                </label>
                <span className="text-sm text-gray-500">{settings.stability}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.stability}
                onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values make the voice more consistent
              </p>
            </div>

            {/* Similarity Boost */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Similarity Boost
                </label>
                <span className="text-sm text-gray-500">{settings.similarity_boost}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.similarity_boost}
                onChange={(e) => handleSettingChange('similarity_boost', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values make the voice more similar to the original
              </p>
            </div>

            {/* Style */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Style
                </label>
                <span className="text-sm text-gray-500">{settings.style}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.style}
                onChange={(e) => handleSettingChange('style', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values add more style and expressiveness
              </p>
            </div>

            {/* Speaker Boost */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Speaker Boost
              </label>
              <input
                type="checkbox"
                checked={settings.use_speaker_boost}
                onChange={(e) => handleSettingChange('use_speaker_boost', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

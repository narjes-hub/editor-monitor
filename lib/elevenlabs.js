/**
 * ElevenLabs API Integration
 * Generates voice audio from text using ElevenLabs API
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// Default voice ID (Rachel - clear female voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Generate speech from text
 * @param {string} text - The text to convert to speech
 * @param {object} options - Optional settings
 * @returns {Promise<object>} - Audio data or error
 */
async function generateSpeech(text, options = {}) {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ElevenLabs API key not configured'
    };
  }

  const voiceId = options.voiceId || DEFAULT_VOICE_ID;
  const modelId = options.modelId || 'eleven_monolingual_v1';

  try {
    const response = await fetch(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.75
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.detail || `ElevenLabs API error: ${response.status}`
      };
    }

    // Get audio as base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      success: true,
      audio: base64Audio,
      contentType: 'audio/mpeg',
      voiceId: voiceId
    };

  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate speech'
    };
  }
}

/**
 * Get available voices
 * @returns {Promise<object>} - List of voices or error
 */
async function getVoices() {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ElevenLabs API key not configured'
    };
  }

  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch voices: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      voices: data.voices
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get user subscription info (to check remaining characters)
 * @returns {Promise<object>} - Subscription info or error
 */
async function getSubscriptionInfo() {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ElevenLabs API key not configured'
    };
  }

  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/user/subscription`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch subscription: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      subscription: data
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateSpeech,
  getVoices,
  getSubscriptionInfo
};

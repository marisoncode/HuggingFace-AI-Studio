/**
 * AI Intelligence Studio API Service
 * Base URL dynamically resolved from VITE_API_URL or defaults to user's Render backend
 * Automatically cleans double slashes and trailing slashes for zero URL errors.
 */

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://127.0.0.1:8000'
    : 'https://huggingface-ai-studio.onrender.com');
export const BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Safely constructs API URLs avoiding double slashes (//api)
 */
function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${cleanEndpoint}`;
}

/**
 * Generic helper for JSON API POST requests with error handling
 */
async function postJSON(endpoint, data) {
  const url = getApiUrl(endpoint);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Server error (${response.status}): ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to backend server at ${BASE_URL}. Please ensure FastAPI server is running on Render.`);
    }
    throw error;
  }
}

/**
 * Generic helper for Multipart/FormData API POST requests (file uploads)
 */
async function postFormData(endpoint, file) {
  const url = getApiUrl(endpoint);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Server error (${response.status}): ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to backend server at ${BASE_URL}. Please ensure FastAPI server is running on Render.`);
    }
    throw error;
  }
}

/* ==========================================================================
   1. NLP Capabilities
   ========================================================================== */

/**
 * Financial Sentiment Analysis
 * POST /api/nlp/sentiment
 */
export async function analyzeSentiment(text) {
  if (!text || !text.trim()) {
    throw new Error('Text input cannot be empty.');
  }
  return await postJSON('/api/nlp/sentiment', { text: text.trim() });
}

/**
 * Text Summarization
 * POST /api/nlp/summarize
 */
export async function summarizeText(text, maxLenOrOptions = {}, minLen) {
  if (!text || !text.trim()) {
    throw new Error('Text input cannot be empty.');
  }

  let maxLength = 130;
  let minLength = 30;

  if (typeof maxLenOrOptions === 'object' && maxLenOrOptions !== null) {
    maxLength = maxLenOrOptions.max_length || maxLenOrOptions.maxLength || 130;
    minLength = maxLenOrOptions.min_length || maxLenOrOptions.minLength || 30;
  } else if (typeof maxLenOrOptions === 'number') {
    maxLength = maxLenOrOptions;
    if (typeof minLen === 'number') {
      minLength = minLen;
    }
  }

  const payload = {
    text: text.trim(),
    max_length: Number(maxLength),
    min_length: Number(minLength),
  };
  return await postJSON('/api/nlp/summarize', payload);
}

/**
 * Named Entity Recognition (NER)
 * POST /api/nlp/ner
 */
export async function recognizeEntities(text) {
  if (!text || !text.trim()) {
    throw new Error('Text input cannot be empty.');
  }
  return await postJSON('/api/nlp/ner', { text: text.trim() });
}

export const extractNER = recognizeEntities;

/**
 * Extractive Question Answering
 * POST /api/nlp/question-answer
 */
export async function answerQuestion(question, context) {
  if (!question || !question.trim()) {
    throw new Error('Question field cannot be empty.');
  }
  if (!context || !context.trim()) {
    throw new Error('Context passage cannot be empty.');
  }
  return await postJSON('/api/nlp/question-answer', {
    question: question.trim(),
    context: context.trim(),
  });
}

/**
 * English -> French Translation
 * POST /api/nlp/translate
 */
export async function translateText(text, targetLanguage = 'French') {
  if (!text || !text.trim()) {
    throw new Error('Text input cannot be empty.');
  }
  return await postJSON('/api/nlp/translate', {
    text: text.trim(),
    target_language: targetLanguage,
  });
}

/* ==========================================================================
   2. Vision Capabilities
   ========================================================================== */

/**
 * Image Classification
 * POST /api/vision/classify
 */
export async function classifyImage(file) {
  if (!file) {
    throw new Error('Please select an image file to upload.');
  }
  return await postFormData('/api/vision/classify', file);
}

/**
 * Image Captioning
 * POST /api/vision/caption
 */
export async function captionImage(file) {
  if (!file) {
    throw new Error('Please select an image file to upload.');
  }
  return await postFormData('/api/vision/caption', file);
}

/* ==========================================================================
   3. Audio Capabilities
   ========================================================================== */

/**
 * Speech-to-Text Transcription
 * POST /api/audio/transcribe
 */
export async function transcribeAudio(file) {
  if (!file) {
    throw new Error('Please select an audio file to upload.');
  }
  return await postFormData('/api/audio/transcribe', file);
}

export const transcribeSpeech = transcribeAudio;

export default {
  BASE_URL,
  analyzeSentiment,
  summarizeText,
  recognizeEntities,
  extractNER,
  answerQuestion,
  translateText,
  classifyImage,
  captionImage,
  transcribeAudio,
  transcribeSpeech,
};

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI server-side with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for safe error handling
function handleApiError(res: express.Response, error: unknown, fallbackMessage: string) {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : fallbackMessage;
  res.status(500).json({ error: message });
}

// 1. Text-to-Speech endpoint (gemini-3.8-flash-tts)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', speaker = 'Narrator', style } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const narrationStyle = style || 'Warm, expressive, gentle storybook narrator speaking clearly at a comfortable pace for Grade 5 elementary English learners';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                speaker: speaker || 'Narrator',
                style: narrationStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS.');
    }

    res.json({
      audio: base64Audio,
      mimeType,
    });
  } catch (error) {
    handleApiError(res, error, 'Failed to generate text-to-speech');
  }
});

// 2. High-quality Image Generation endpoint (gemini-3-pro-image-preview)
// Supports affordance for user to specify image size: 1K, 2K, 4K
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, size = '1K', aspectRatio = '4:3', pageContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    // Validate size to 1K, 2K, or 4K as requested
    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(size) ? size : '1K';

    const enrichedPrompt = `Children's storybook illustration style, charming watercolor and vibrant digital art with soft whimsical lighting: ${prompt}. Cute friendly characters, expressive faces, storybook warmth, suitable for 5th grade picture book.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: enrichedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '4:3',
          imageSize: selectedSize as '1K' | '2K' | '4K',
        },
      },
    });

    let base64Image: string | null = null;
    let mimeType = 'image/png';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        base64Image = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!base64Image) {
      throw new Error('No image was returned from Gemini Pro Image model.');
    }

    res.json({
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      size: selectedSize,
      prompt,
    });
  } catch (error) {
    handleApiError(res, error, 'Failed to generate illustration');
  }
});

// 3. Multi-turn Chatbot endpoint with role-based system instructions
// Models:
// - gemini-3.1-pro-preview for particularly complex tasks (e.g. detailed grammar explanations, complex story writing)
// - gemini-3.5-flash for general tasks (e.g. story companion Lumi conversation, reading questions)
// - gemini-3.1-flash-lite for tasks that should happen fast (e.g. quick vocab meaning, flashcard quiz, fast hints)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, botRole = 'lumi', complexity = 'general' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    // Determine model according to requirements:
    // - gemini-3.1-pro-preview for particularly complex tasks
    // - gemini-3.5-flash for general tasks
    // - gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = 'gemini-3.5-flash';
    if (complexity === 'complex') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (complexity === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    // Define role-specific system instructions
    let systemInstruction = '';
    if (botRole === 'lumi') {
      systemInstruction = `You are Lumi, the cute, friendly, slightly shy little green dragon from the story "The Little Dragon's Lost Fire". 
You are chatting with a 5th grade elementary English learner (CEFR A1 level).
Your traits:
- Speak in simple, clear, encouraging English (easy CEFR A1 words, short sentences).
- If appropriate, provide a cheerful Korean translation in parentheses for key words so Korean Grade 5 learners understand you easily (e.g., "I sneezed! (에취!)").
- You love your friends: the rabbit and the singing bird. You love climbing the mountain and discovering your warm inner spark.
- Keep responses friendly, warm, playful, and under 3-4 sentences. Include cute emojis like 🐉, 🔥, 🌲, 💖!`;
    } else if (botRole === 'sparky_guide') {
      systemInstruction = `You are Sparky, an expert children's English reading tutor and story guide for 5th grade elementary students (CEFR A1 level).
Your task:
- Guide the student through "The Little Dragon's Lost Fire".
- Reinforce target vocabulary: dragon, fire, forest, rabbit, bird, river, mountain, lost, afraid, brave, friend, help.
- Teach the key sentence pattern: "Have you seen my fire?".
- Praise the learner gently and scaffold their English. Provide supportive explanations with Korean translations when helpful.
- When asked complex questions about grammar, plot, or writing stories, break them down clearly into friendly steps.`;
    } else if (botRole === 'vocab_detective') {
      systemInstruction = `You are the Vocab Detective, a fast and lively English vocabulary buddy for 5th graders.
Provide lightning-fast, ultra-clear definitions with:
1. Simple English definition
2. Korean meaning (한국어 뜻)
3. Pronunciation tip
4. An easy example sentence!
Keep answers concise, fun, and energetic!`;
    } else {
      systemInstruction = `You are a helpful and kind educational assistant for 5th grade English language learners reading a storybook. Speak in simple, encouraging English.`;
    }

    // Format contents history for Gemini SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Hello! Let's read together! 🐉";

    res.json({
      reply,
      modelUsed: selectedModel,
    });
  } catch (error) {
    handleApiError(res, error, 'Failed to complete chat message');
  }
});

// 4. Speaking practice evaluation (PEER sequence feedback: prompt -> evaluate -> expand -> repeat)
app.post('/api/evaluate-speech', async (req, res) => {
  try {
    const { targetSentence, userSpokenText } = req.body;
    if (!targetSentence) {
      res.status(400).json({ error: 'Target sentence is required' });
      return;
    }

    if (!apiKey) {
      // Friendly local fallback if no key
      res.json({
        score: 95,
        feedback: "Wonderful try! You sounded just like Lumi!",
        expansion: "Can you ask the bird next: 'Have you seen my fire?'",
        encouragement: "Great job! Keep speaking!"
      });
      return;
    }

    const prompt = `Grade 5 English speaking evaluation.
Target sentence: "${targetSentence}"
Student spoken sentence: "${userSpokenText || '(silent or attempted)'}"

Provide gentle, positive CEFR A1 feedback following the PEER sequence:
- Supportive feedback (never harsh, no penalty).
- A cheerful tip for pronunciation or expression.
- An expansion sentence for the student to try next.
Format as JSON with keys: feedback, expansion, encouragement, score (0-100).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let jsonResult;
    try {
      jsonResult = JSON.parse(response.text || '{}');
    } catch {
      jsonResult = {
        feedback: "Super effort! Your voice is clear and brave!",
        expansion: "Let's say it louder together: Have you seen my fire?",
        encouragement: "You did it! 🌟",
        score: 90
      };
    }

    res.json(jsonResult);
  } catch (error) {
    handleApiError(res, error, 'Failed to evaluate speaking practice');
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction && fs.existsSync(path.resolve(__dirname, 'vite.config.ts'))) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DragonTales full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
});

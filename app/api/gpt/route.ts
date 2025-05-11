// app/api/gpt/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// interface ChatMessage {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// }

interface QuizQuestion {
  artist: string;
  questionText: string;
  options: string[];       // ["A) …", "B) …", ...]
  correctOption: string;   // e.g. "A"
}

interface QuizData {
  questions: QuizQuestion[];
  summary: string;
}

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generates a quiz for the given artists.
 */
async function generateQuiz(
  artists: string[],
  nbrQuestions = 10
): Promise<QuizData> {
  const artistsString = artists.join(', ');
  const prompt = `
You are to generate a quiz based on the following artists: ${artistsString}.
Don't make the artists the options, provide instead a question that is about one of the artists.
Please create a quiz of ${nbrQuestions} multiple-choice questions. Independently of how many artists there are,
if there are fewer artists than questions, create one question per artist and then randomly choose some artists from provided list to generate an additional question.
Each question should have:

- A question text.
- Four options labeled A, B, C, and D.
- The correct option indicated after a newline with the text "Answer: " following the options.

At the end, provide a summary of all questions with their correct answers.

Format the output as a JSON object with the following structure without any code fences or Markdown:

{
  "questions": [
    { 
      "artist": "The artist of whom the question is about",
      "questionText": "Question text here",
      "options": [
        "A) Option A text",
        "B) Option B text",
        "C) Option C text",
        "D) Option D text"
      ],
      "correctOption": "A"
    }
    // ... more questions
  ],
  "summary": "A summary of all questions and correct answers."
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('No response from OpenAI');
  }

  // Try raw parse, then strip fences if needed
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    const noFences = text.replace(/```json\s*|\s*```/g, '').trim();
    parsed = JSON.parse(noFences);
  }

  // Basic runtime shape-check (optional, you can expand these checks)
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    Array.isArray((parsed as QuizData).questions) &&
    typeof (parsed as QuizData).summary === 'string'
  ) {
    return parsed as QuizData;
  } else {
    throw new Error('Invalid quiz format from OpenAI');
  }
}

/**
 * POST /api/gpt
 * Body: { artists: string[], nbrQuestions?: number }
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('artists' in body)
    ) {
      return NextResponse.json(
        { error: 'Missing "artists" array in body' },
        { status: 400 }
      );
    }

    const { artists, nbrQuestions } = body as {
      artists: unknown;
      nbrQuestions?: unknown;
    };

    if (
      !Array.isArray(artists) ||
      !artists.every((a) => typeof a === 'string')
    ) {
      return NextResponse.json(
        { error: '"artists" must be a string[]' },
        { status: 400 }
      );
    }

    const count =
      typeof nbrQuestions === 'number' && nbrQuestions > 0
        ? nbrQuestions
        : undefined;

    const quizData = await generateQuiz(artists, count);
    return NextResponse.json(quizData);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('GPT route error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

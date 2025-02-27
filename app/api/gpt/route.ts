// app/api/bot/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generates a quiz based on the provided artists and number of questions.
 * Calls the OpenAI API using a prompt that instructs GPT-4 to generate a quiz.
 */
async function generateQuiz(artists: string[], nbrQuestions: number = 10): Promise<any> {
  const artistsString = artists.join(', ');
  console.log(`Generating quiz for artists: ${artistsString}`);

  const prompt = `
You are to generate a quiz based on the following artists: ${artistsString}.

Please create a quiz of ${nbrQuestions} multiple-choice questions. Independently of how many artists there are,
if there are fewer artists than questions, create one question per artist and then randomly choose some artists to generate an additional question.
Each question should have:

- A question text.
- Four options labeled A, B, C, and D.
- The correct option indicated after a newline with the text "Answer: " following the options.

At the end, provide a summary of all questions with their correct answers.

Format the output as a JSON object with the following structure without any code fences or Markdown:

{
  "questions": [
    {
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

  try {
    // Request a completion from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
    });

    if (
        !completion.choices ||
        completion.choices.length === 0 ||
        !completion.choices[0].message ||
        !completion.choices[0].message.content
      ) {
        throw new Error('No valid response received from OpenAI');
      }

    // Get and trim the response text
    const responseText = completion.choices[0].message.content.trim();
    console.log('Raw Response from OpenAI:', responseText);

    // Attempt to parse the JSON response
    let quizData;
    try {
      quizData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      // Remove code fences if present and try parsing again
      const jsonString = responseText.replace(/```json\s*|\s*```/g, '').trim();
      try {
        quizData = JSON.parse(jsonString);
        console.log('Parsed JSON after stripping code fences.');
      } catch (innerError) {
        console.error('Failed to parse JSON after stripping code fences:', innerError);
        throw new Error('Invalid response format from OpenAI API');
      }
    }
    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}

/**
 * POST handler for /api/bot.
 * Expects a JSON body with 'artists' (string array) and 'nbrQuestions' (number).
 * Returns the generated quiz data in JSON format.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artists, nbrQuestions } = body;

    if (!artists || !Array.isArray(artists)) {
      return NextResponse.json(
        { error: 'Missing or invalid "artists" in the request body' },
        { status: 400 }
      );
    }

    const quizData = await generateQuiz(artists, nbrQuestions);
    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

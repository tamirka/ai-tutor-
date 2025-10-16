import { ChatMessage, QuizQuestion } from '../types';

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
}

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;

export async function getOpenAIStreamedResponse(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages.map(({role, content}) => ({role, content})),
            stream: true,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    return response.body;
}

export async function getOpenAIQuiz(messages: ChatMessage[]): Promise<QuizQuestion[]> {
     const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages.map(({role, content}) => ({role, content})),
            response_format: { type: "json_object" },
        }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(error.error?.message || 'Failed to get quiz from OpenAI');
    }
    
    const data = await response.json();
    const jsonText = data.choices[0].message.content;
    
    try {
        const parsed = JSON.parse(jsonText);
        if (parsed.questions && Array.isArray(parsed.questions)) {
            return parsed.questions;
        }
        if (Array.isArray(parsed)) {
            return parsed;
        }
        throw new Error("Could not find a 'questions' array in the JSON response.");
    } catch(e) {
        console.error("Failed to parse quiz JSON from OpenAI", e);
        throw new Error("Received malformed JSON from the API.");
    }
}

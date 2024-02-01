import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const instructionMessage: OpenAI.Chat.ChatCompletionMessage = {
    role: "system",
    content: "You are a code generator just , You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured.", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k-0613",
            messages: [instructionMessage, ...messages],
        })
        return new NextResponse(JSON.stringify(response.choices[0].message))
    } catch (error) {
        console.log('[CONVERSATION_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

//gpt-4
// gpt-4-0613
// gpt-4-1106-preview
// gpt-4-vision-preview
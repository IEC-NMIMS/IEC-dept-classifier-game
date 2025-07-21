import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export async function POST(req: NextRequest) {
  try {
    const { answers, departmentDescription } = await req.json();

    if (!answers || !departmentDescription) {
      return NextResponse.json({ error: 'Missing answers or department description' }, { status: 400 });
    }

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.7,
    });

    const template = `
      Based on the following quiz answers and the resulting department description, create a personalized summary for the user.
      Explain why the user is a good fit for the department based on the specific choices they made.
      Make it encouraging and insightful.

      User's Answers:
      {answers}

      Department Description:
      {departmentDescription}

      Personalized Summary:
    `;

    const prompt = PromptTemplate.fromTemplate(template);
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(llm).pipe(outputParser);

    const summary = await chain.invoke({
        answers: answers.join(', '),
        departmentDescription,
    });


    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
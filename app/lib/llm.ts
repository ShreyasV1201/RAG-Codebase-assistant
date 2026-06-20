import ollama from "ollama";

export async function generateAnswer(
  question: string,
  context: string,
  settings?: any,
) {
  const response = await ollama.chat({
    model: settings?.model || "phi3",
    messages: [
      {
        role: "system",
        content: `
You are an expert codebase assistant.

Answer ONLY using the supplied context.

Requirements:
- Explain your reasoning clearly.
- Mention relevant file names.
- Mention important functions, classes, routes, and components.
- If multiple files are involved, explain how they interact.
- Use bullet points when helpful.
- Give detailed answers when enough context exists.

If the answer is not present in the context, respond:
"I could not find that in the codebase."
`,
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}
`,
      },
    ],
    options: {
      temperature: settings?.temperature ?? 0.1,
      num_predict: settings?.maxTokens ?? 400,
    },
  });

  console.log("OLLAMA RESPONSE:");
  console.dir(response, { depth: null });

  return response.message.content.trim();
}

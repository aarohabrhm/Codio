import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const aiChat = async (req, res) => {
  const { messages, model, activeFile } = req.body;

  const systemPrompt = activeFile
    ? `You are an expert coding assistant embedded in a collaborative code editor.

The user currently has this file open:
Filename: ${activeFile.name}
Language: ${activeFile.language}

File contents:
\`\`\`${activeFile.language}
${activeFile.content}
\`\`\`

IMPORTANT RULES FOR CODE SUGGESTIONS:
- When suggesting changes to the current file, ALWAYS return the COMPLETE updated file content in a single code block — not just a snippet. This is because the user will click "Apply" and it will be diffed and applied line by line.
- If the user asks a general question or you're showing a small standalone example, a partial snippet is fine.
- Always specify the language in your code blocks.
- Be concise in your explanations.`
    : `You are an expert coding assistant. Be concise and helpful. When suggesting code changes, always wrap them in markdown code blocks with the language specified.`;

  try {
    // ── OpenAI ──────────────────────────────────────────────
    if (["gpt-4o", "gpt-4", "gpt-3.5-turbo"].includes(model)) {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
        max_tokens: 2048,
      });
      return res.json({ reply: response.choices[0].message.content });
    }

    // ── Anthropic ────────────────────────────────────────────
    if (["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"].includes(model)) {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      });
      return res.json({ reply: response.content[0].text });
    }

    // ── Gemini ───────────────────────────────────────────────
    if (["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-lite"].includes(model)) {
      const geminiModel = genAI.getGenerativeModel({
        model,
        systemInstruction: systemPrompt,
      });

      // Build history from all messages except the last one
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const chat = geminiModel.startChat({ history });
      const lastMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(lastMessage);
      return res.json({ reply: result.response.text() });
    }

    return res.status(400).json({ message: "Unsupported model" });

  } catch (err) {
    console.error("AI error:", err.message);
    return res.status(500).json({ message: "AI request failed", detail: err.message });
  }
};
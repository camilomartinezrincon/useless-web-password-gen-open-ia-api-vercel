import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { username, passwordOptions, passwordLength, fanOf } = req.body;

  if (!passwordLength) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const prompt = `Generate a secure password of ${passwordLength} who is a fan of ${fanOf || "nothing in particular"}. 
Password rules: 
- Uppercase: ${passwordOptions?.uppercase ? "yes" : "no"} 
- Lowercase: ${passwordOptions?.lowercase ? "yes" : "no"} 
- Numbers: ${passwordOptions?.numbers ? "yes" : "no"} 
- Symbols: ${passwordOptions?.symbols ? "yes" : "no"}
Respond ONLY with the password, no explanation.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a secure password generator. Respond only with the generated password, nothing else.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      max_tokens: 50,
      temperature: 1,
    });

    const generatedPassword = completion.choices[0].message.content.trim();
    res.json({ generatedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

// Load environment variables from .env file

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = async () => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.0,
      system: "Respond only in Yoda-speak.",
      messages: [{ role: "user", content: "How are you today?" }],
    });

    console.log(response.content);
  } catch (error) {
    console.error(error);
  }
};

message();

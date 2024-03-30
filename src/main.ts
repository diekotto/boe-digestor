import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import pdf from "pdf-parse";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const downloadPdf = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
};

const parsePdf = async (buffer: Buffer) => {
  const data = await pdf(buffer);
  return data.text;
};
const message = async (content: string) => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.0,
      system: [
        "The user will send the content of a pdf, resume the content and provide the main points.",
        "If something remarable, mention it.",
        "If further information seems to be relevant, recommend ask more info regarding the points or topics you consider relevant."
      ].join(" "),
      messages: [{ role: "user", content }],
    });

    console.log(response.content);
  } catch (error) {
    console.error(error);
  }
};

const run = async () => {
  const pdfUrl = 'https://boe.es/boe/dias/2024/03/30/pdfs/BOE-S-2024-79.pdf';
  const pdfBuffer = await downloadPdf(pdfUrl);
  const pdfText = await parsePdf(pdfBuffer);
  await message(pdfText);
};

run();

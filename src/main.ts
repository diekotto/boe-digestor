import "dotenv/config";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import pdf from "pdf-parse";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const downloadPdf = async (url: string) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    },
  });
  return response.data;
};

const parsePdf = async (buffer: Buffer) => {
  const data = await pdf(buffer);
  return data.text;
};
const message = async (content: string): Promise<string> => {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    temperature: 0.0,
    system: [
      "The user will send the content of a pdf, resume the content and provide the main points.",
      "The answer expected to have an structure with xml sections, all inside <main> tag.",
      "<title>title of the document</title>",
      "<summary>The main points of the document, summarizing them.</summary>",
      "<remarkable>If there is something remarkable, mention it.</remarkable>",
      "<further_information>If it seems pertinent, recommend asking for more information on the points or topics you consider relevant.</further_information>",
      "<sections>Numbered list of the sections of the file with its title</sections>",
      "Check the sections well, categorizing is important.",
      "Answer always in spanish and using a language for non-experts and non-lawyers.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: [
          '<document index="1">',
          "<source>BOE</source>",
          "<document_content>",
          content,
          "</document_content>",
          "</document>",
        ].join("\n"),
      },
    ],
  });

  return response.content[0].text;
};

const run = async () => {
  const pdfUrl = "https://boe.es/boe/dias/2024/03/30/pdfs/BOE-S-2024-79.pdf";
  const pdfBuffer = await downloadPdf(pdfUrl);
  const pdfText = await parsePdf(pdfBuffer);
  const answer = await message(pdfText);
  fs.writeFileSync(
    path.join(__dirname, "..", "output", "BOE-S-2024-79.xml"),
    answer,
    {
      encoding: "utf-8",
    }
  );
};

run();

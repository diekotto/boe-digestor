import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import pdf from 'pdf-parse';

// The patter of the local pdfs is docs/<year>/BOE-S-\<year\>-\<count\>.pdf

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const parsePdf = async (buffer: Buffer) => {
  const data = await pdf(buffer);
  return data.text;
};

const message = async (content: string): Promise<string> => {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    temperature: 0.0,
    system: [
      'The user will send the content of a pdf, resume the content and provide the main points.',
      'The answer expected to have an structure with xml sections, all inside <main> tag.',
      '<title>title of the document</title>',
      '<summary>The main points of the document, summarizing them.</summary>',
      '<remarkable>If there is something remarkable, mention it.</remarkable>',
      '<further_information>If it seems pertinent, recommend asking for more information on the points or topics you consider relevant.</further_information>',
      '<sections>Numbered list of the sections of the file with its title</sections>',
      'Check the sections well, categorizing is important.',
      'Answer always in spanish and using a language for non-experts and non-lawyers.',
    ].join(' '),
    messages: [
      {
        role: 'user',
        content: [
          '<document index="1">',
          '<source>BOE</source>',
          '<document_content>',
          content,
          '</document_content>',
          '</document>',
        ].join('\n'),
      },
    ],
  });

  return response.content[0].text;
};

const run = async () => {
  const files = fs.readdirSync(path.join(__dirname, '..', 'docs', '2024'));
  for (const file of files) {
    const pdfPath = path.join(__dirname, '..', 'docs', '2024', file);
    const xmlPath = path.join(__dirname, '..', 'output', file.replace('pdf', 'xml'));
    if (fs.existsSync(xmlPath)) {
      continue;
    }
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfText = await parsePdf(pdfBuffer);
    console.log(`Processing ${file}`);
    const answer = await message(pdfText);
    console.log('File processed\n');
    fs.writeFileSync(xmlPath, answer, {
      encoding: 'utf-8',
    });
    await sleep(5000);
  }
};

run();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

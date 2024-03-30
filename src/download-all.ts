/**
# Patrones de publicación web del BOE
### Vamos a analizar los sumarios del BOE, no los pdfs individuales.
Las url de los sumarios del BOE siguen el siguiente patrón:
> https://boe.es/boe/dias/\<year\>/\<month\>/\<day\>/pdfs/BOE-S-\<year\>-\<count\>.pdf
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const downloadPdf = async (url: string) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    },
  });
  return response.data;
};

const run = async () => {
  const date = new Date('2024-01-01');
  let count = 1;
  let notFound = false;
  while (!notFound) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    // if the day is sunday, we skip it
    if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
      continue;
    }
    const pdfUrl = `https://boe.es/boe/dias/${year}/${month}/${day}/pdfs/BOE-S-${year}-${count}.pdf`;
    let pdfBuffer = null;
    try {
      if (!fs.existsSync(path.join(__dirname, '..', 'docs', `${year}`, `BOE-S-${year}-${count}.pdf`))) {
        pdfBuffer = await downloadPdf(pdfUrl);
        fs.writeFileSync(path.join(__dirname, '..', 'docs', `${year}`, `BOE-S-${year}-${count}.pdf`), pdfBuffer);
        await sleep(1000);
      }
    } catch (e) {
      console.log(`No se ha encontrado el pdf ${pdfUrl}`);
      notFound = true;
    }
    count++;
    // If the day is 17 de febrero de 2024, we need to retry the day with increased count
    if (date.getDate() === 17 && date.getMonth() === 1 && date.getFullYear() === 2024 && count <= 43) {
      date.setDate(date.getDate() - 1);
    }
    date.setDate(date.getDate() + 1);
  }
};

run();

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

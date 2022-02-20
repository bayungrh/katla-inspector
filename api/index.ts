import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchWord, fetchDefine } from '../utils/fetch';

export default async function (_: VercelRequest, res: VercelResponse) {
  const word = await fetchWord();
  const defineWord = await fetchDefine(word);
  const defineWordText = defineWord.join('<br/>');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width"/>
        <meta charSet="utf-8"/>
      </head>
      <body>
        <span style="font-size: 15pt;">Katla hari ini adalah :</span><br/><br/>
        <div style="width: 480px;">
          <hr style="border: 1px dashed darkgrey;"/>
          <strong style="font-size: 21pt;">${word}</strong>
          : ${defineWordText}
          <hr style="border: 1px dashed darkgrey;"/>
        </div>
        <div style="padding-top:20px;">
          <a style="text-decoration:none;" href="https://github.com/bayungrh/katla-inspector">· Github</a>
        </div>
      </body>
    </html>
  `);
};

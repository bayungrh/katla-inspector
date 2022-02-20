import type { VercelRequest, VercelResponse } from '@vercel/node';
import getProps from '../utils/fetch';

export default async function (_: VercelRequest, res: VercelResponse) {
  const word = await getProps();
  res.send(`Katla hari ini adalah : <h3>${word}</h3>`);
};

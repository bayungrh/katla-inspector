import req from 'unirest';
import cheerio from 'cheerio';
import decode from './codec';

export default async function getProps(): Promise<string|boolean|object> {
  try {
    const katla = await req.get('https://katla.id/');
    const $ = cheerio.load(katla.body);
    let buildId: string;
    $('script').each((_, tag) => {
      let findBuildId: string;
      const src = $(tag).attr('src');
      if (src && src.indexOf('buildManifest') > -1) {
        findBuildId = src;
      }
      if (findBuildId) {
        buildId = findBuildId.split('/')[3];
      }
    })
    if (buildId) {
      const getPageProps = await req.get(`https://katla.id/_next/data/${buildId}/index.json`);
      const { pageProps } = getPageProps.body;
      const { hashed } = pageProps;
      const decodeHashed = decode(hashed);
      const lastHashed = decodeHashed.split('::').slice(-1);
      const decodeWord = decode(lastHashed[0]);
      return decodeWord;
    }
    return false;
  } catch (error) {
    console.log('Error', error.message);
    throw error;
  }
}

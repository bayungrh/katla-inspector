import req from 'unirest';
import cheerio from 'cheerio';
import decode from './codec';

const BASEURI = 'https://katla.id';
const USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36';

export async function fetchWord(): Promise<string> {
  try {
    const katla = await req
      .get(BASEURI)
      .headers({
        'user-agent': USERAGENT,
        'referer': BASEURI
      });
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
      const getPageProps = await req.get(`${BASEURI}/_next/data/${buildId}/index.json`);
      const { pageProps } = getPageProps.body;
      const { hashed } = pageProps;
      const decodeHashed = decode(hashed);
      const lastHashed = decodeHashed.split('::')[1];
      const decodeWord = decode(lastHashed);
      return decodeWord;
    }
    return '';
  } catch (error) {
    console.log('Error fetchWord', error.message);
    throw error;
  }
}

export async function fetchDefine(word: string | string[]) {
  try {
    const reqDefine = await req
      .get(`${BASEURI}/api/define/${word}`)
      .headers({
        'authorization': 'token bkZwZWC',
        'user-agent': USERAGENT,
        'referer': BASEURI
      });
    return reqDefine.body;
  } catch (error) {
    console.log('Error fetchDefine', error);
    throw error;
  }
}

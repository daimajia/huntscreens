import { parse } from 'node-html-parser';
import { removeUrlParams } from './utils/url';

type PuppeteerResp = {
  error: boolean,
  source: string | null
}

function removeTAAFTQueryParams(url?: string | null) {
  if(!url) throw new Error('not a valid url');
  return removeUrlParams(url, ['ref', 'term', 'utm_medium', 'utm_source', 'utm_source']);
}

export async function fetchTAAFTLatest() {
  const resp = await fetch(`${process.env.PUPPETEER}/api/source?url=https://theresanaiforthat.com/just-launched/`, {next: {revalidate: 3000}});
  const json = await resp.json() as PuppeteerResp;
  if(!json.error && json.source){
    const root = parse(json.source);
    const ais = root.querySelectorAll("div.li_row");
    const results = ais.flatMap((item) => {
      const icon = item.querySelector('.li_left img');
      const taaft_link = item.querySelector('.ai_link');
      const product_name = taaft_link?.innerText;
      const product_link = item.querySelector('a.external_ai_link')?.attributes['href'];
      return {
        icon: icon?.attributes['src'],
        product_name: product_name,
        product_link: product_link,
        taaft_link: 'https://theresanaiforthat.com/' + taaft_link?.attributes['href']
      }
    })
    return results;
  }else{
    throw new Error('taaft puppeteer return error');
  }
}

export async function fetchProductDetails(url: string) {
  const resp = await fetch(`${process.env.PUPPETEER}/api/source?url=${url}`, {next: {revalidate: 3000}});
  const json = await resp.json() as PuppeteerResp;
  if(json.error || !json.source) throw new Error('taaft puppeteer return error');
  const root = parse(json.source);
  const description = root.querySelector('div.description')?.innerText.trim();
  const product_name = root.querySelector('h1.title_inner')?.innerText;
  const product_icon = root.querySelector('img.taaft_icon')?.attributes['src'];
  const product_link = root.querySelector('a#ai_top_link')?.attributes['href'];
  const product_saves = root.querySelector('div.saves')?.innerText;
  const main_category = root.querySelector('a.task_label')?.innerText.trim();
  const tags = root.querySelectorAll('a.tag').flatMap((item) => item.innerText);
  const pros = root.querySelectorAll('div.pac-info-item-pros>div').flatMap((item) => item.innerText);
  const cons = root.querySelectorAll('div.pac-info-item-cons>div').flatMap((item) => item.innerText);
  const comments = root.querySelector('a.comments')?.innerText;
  const launch = root.querySelector('span.launch_date_top')?.innerText;
  const screenshot = root.querySelector('img.ai_image')?.attributes['src'];
  const faqs = root.querySelectorAll('div.faq-info').flatMap((item) => ({
    question: item.querySelector('div.faq-info-title')?.innerText,
    answer: item.querySelector('div.faq-info-description')?.innerText
  }))
  const related = root.querySelector('div.box:has(h2#recommendations)');
  const related_products = related?.querySelectorAll('div.li_row').flatMap((item) => {
      const icon = item.querySelector('.li_left img');
      const taaft_link = item.querySelector('.ai_link');
      const product_name = taaft_link?.innerText;
      const product_link = item.querySelector('a.external_ai_link')?.attributes['href'];
      return {
        icon: icon?.attributes['src'],
        product_name: product_name,
        product_link: removeTAAFTQueryParams(product_link),
        taaft_link: removeTAAFTQueryParams('https://theresanaiforthat.com/' + taaft_link?.attributes['href'])
      }
  });
  
  return {
    name: product_name,
    website: removeTAAFTQueryParams(product_link),
    thumbnail: product_icon,
    main_category: main_category,
    description: description,
    savesCount: Number(product_saves),
    commentsCount: Number(comments),
    added_at: new Date(launch!),
    screenshot: screenshot,
    related: related_products,
    pros: pros,
    cons: cons,
    tags: tags,
    faqs: faqs
  }
}
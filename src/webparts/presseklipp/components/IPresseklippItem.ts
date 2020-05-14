export interface IPresseklippItem {
  first_source: {sitename: string, url: string};
  header: {text: string};
  summary: {text: string};
  quotes?: {quote: {text: string}};
  articleimages?: {count: number, articleimage: [{url: string}]};
  screenshots: [{text: string}];
  orig_url: string;
  url_common: string;
  local_rcf822_time: {text: string};
  mediatype: {text: string};
  compressed: boolean;
  matches: [{color: number, text: string}];
}
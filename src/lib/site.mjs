import { loadContent, publicContent } from './content.mjs';
export const allContent = loadContent();
export const data = publicContent(allContent);
export const settings = data.settings;
export const copy = data.pageText;
export const themeLabels = Object.fromEntries(['learning','interaction','systems'].map(key=>[key,copy.themes[key]]));
export function href(value = '/') {
  if (/^(https?:|mailto:)/.test(value)) return value;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
}
export function inquiryUrl(subject = copy.opportunities.emailSubject) { return `mailto:${settings.email}?subject=${encodeURIComponent(subject)}`; }

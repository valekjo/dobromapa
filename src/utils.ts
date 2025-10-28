// TODO: We'll need to get rid of this eventually

export const BASE_PATH = '/dobromapa';

export const niceUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export const getUrl = (path: string) => `${BASE_PATH}/${path.replace(/^\//, '')}`
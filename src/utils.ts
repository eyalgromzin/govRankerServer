var url = require('url');

export const getDomain = (i_url) => {
    return url.parse(i_url).protocol + '//' + url.parse(i_url).host
}
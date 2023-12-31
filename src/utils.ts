var url = require('url');

exports.getDomain = (i_url) => {
    return url.parse(i_url).protocol + '//' + url.parse(i_url).host
}
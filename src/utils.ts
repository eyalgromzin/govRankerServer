var url = require('url');

export const getDomain = (i_url) => {
    return url.parse(i_url).protocol + '//' + url.parse(i_url).host
}

export const convertDatetimeToString = (datetime) => {
    return datetime.getFullYear() + '' + (datetime.getMonth() + 1).toString().padStart(2, '0') + '' + datetime.getDate().toString().padStart(2, '0')
}
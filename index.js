let penthouse = require('penthouse');
let fetch = require('node-fetch');
let CleanCSS = require('clean-css');

exports.handler = ({
    key,
    styles,
    url,
    hash,
    return_url,
    site_key
}, context, callback) => Promise.all(styles.map(fetch))
    .then(responses => Promise.all(responses.map(res => res.text())))
    .then(cssStrings => penthouse({
        url,
        cssString: cssStrings.join(' ')
    }))
    .then(criticalCss => fetch(return_url, {
        method: `POST`,
        body: [
            `key=${key}`,
            `hash=${hash}`,
            `stylesheet=${new CleanCSS().minify(criticalCss).styles}`,
            `secret=${process.env.hasOwnProperty(site_key) ? process.env[site_key] : ''}`
        ].join('&')
    }));
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
// const withSass = require('@zeit/next-sass');

module.exports = withCSS(withFonts());
// module.exports = withSass(withCSS(withFonts()));
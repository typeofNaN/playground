const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()
const html = md.render('# test')

console.log(html)
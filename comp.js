const fs = require('fs');
const writeDir = '/dist/';
const readDir = '/src/';

fs.readFile(__dirname + readDir + 'css/style.css', (err, data) => {
    if (err) { throw err; }
    let style = 'const CSS = \`' + data.toString() + '\`;';
    fs.writeFile(__dirname + writeDir + '/css.js', style, err => {
        if (err) { throw err; }
    });
})

fs.readFile(__dirname + readDir + '/index.html', (err, data) => {
    if (err) { throw err; }
    data = data.toString().replace(/\n/gm, '').match(/\<div .*\/body\>/gmi)
    data = data[0].slice(0, data.length - 8)
    let html = 'const HTML = \`' + data + '\`;';
    fs.writeFile(__dirname + writeDir + 'html.js', html, err => {
        if (err) { throw err; }
    });
})

require('child_process').exec(`cd "$HOME/Documents/code/moz-twicopypaste/src"; tsc`);
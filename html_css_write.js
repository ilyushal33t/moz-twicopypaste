const fs = require('fs');

fs.readFile(__dirname + '/style.css', (err, data) => {
    if (err) { throw err; }
    let style = 'const css = \`' + data.toString() + '\`;';
    fs.writeFile(__dirname + '/css.js', style, err => {
        if (err) { throw err; }
    });
})

fs.readFile(__dirname + '/index.html', (err, data) => {
    if (err) { throw err; }
    data = data.toString().replace(/\n/g, '').match(/\<div x\-show\=\"\_main.*\>.*\<\/body\>/gmi)
    data = data[0].slice(0, data.length - 8)
    let html = 'const MAIN_HTML = \`' + data + '\`;';
    fs.writeFile(__dirname + '/html.js', html, err => {
        if (err) { throw err; }
    });
})
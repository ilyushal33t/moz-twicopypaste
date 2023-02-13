const fs = require('fs');

fs.readFile(__dirname + '/style.css', (err, data) => {
    if (err) { throw err; }
    let style = 'const css = \`' + data.toString() + '\`;';
    fs.writeFile(__dirname + '/css.js', style, err => {
        if (err) { throw err; }
    });
})
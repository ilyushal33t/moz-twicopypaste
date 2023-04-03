if (process.argv.includes('build')) {
    const fs = require('fs');
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;


    const writeDir = '/dist/';
    const readDir = '/src/';

    fs.readFile(__dirname + readDir + 'css/style.css', (err, data) => {
        console.log('compiling style.css...')
        if (err) { throw err; }
        let style = 'const CSS = \`' + data.toString() + '\`;';
        fs.writeFile(__dirname + writeDir + '/css.js', style, err => {
            if (err) { throw err; }
        });
    })

    fs.readFile(__dirname + readDir + '/index.html', (err, data) => {
        console.log('compiling index.html...')
        if (err) { throw err; }
        data = new JSDOM(data.toString());
        data = data.window.document.querySelector('.cp-main-data-0ea9e2d3');
        let html = 'const HTML = \`' + data.outerHTML + '\`;';
        fs.writeFile(__dirname + writeDir + 'html.js', html, err => {
            if (err) { throw err; }
        });

        compileTS();
    })

}
else {
    compileTS();
}

function compileTS() {
    console.log('compiling ts to js...')
    require('child_process').exec(`cd ${__dirname}/src; tsc`);
}
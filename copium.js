var loaded = false;
var oldHref = document.location.href;

const WINDOW_WIDTH = 520;
var $underChatGUI, $openButton;

const $style = document.createElement('style');
$style.innerHTML = CSS;
document.head.append($style);

with (browser.runtime) {
    try {
        createScript(getURL('alpine/alpine.min.js'));
        createScript(getURL('alpine/persist.js'));
        createScript(getURL('dist/utils.js'));
        createScript(getURL('dist/script.js'));
    } catch (e) { console.error(e); }
}

window.onanimationstart = async function () {
    // waiting for chat load /* https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists  */

    const bodyList = document.querySelector("body")

    const observer = new MutationObserver(mutations => {
        mutations.forEach(async mutation => {

            if (document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca') === null) {
                document.dispatchEvent(new Event('animanionend'));
            }

            if (oldHref != document.location.href) {
                let $oldWindow = document.querySelector('div.cp-main-data-0ea9e2d3')
                if ($oldWindow) $oldWindow.remove();
                if (loaded) {
                    loaded = false;
                }
                oldHref = document.location.href;
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};

window.onanimationend = async function () {
    if (loaded) return;
    // some add-ons can remove this button and it will not appear so we wait 1 second 
    await sleep(1e3);

    try {
        $underChatGUI = await waitForElm('.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > .Layout-sc-1xcs6mc-0.hOyRCN');
        // const $main = document.querySelector('.Layout-sc-1xcs6mc-0.dajtya');
        const $main = document.querySelector('div#root');
        const $elem = document.createElement('div');
        const $settingsBtn = $underChatGUI.firstChild;
        const $twitchChatBlock = document.querySelector('.Layout-sc-1xcs6mc-0.fLaIqI')
        const $openButton = document.createElement('button');

        addOpenBtn($openButton, $underChatGUI, $settingsBtn);


        $elem.innerHTML = HTML;

        $main.insertBefore($elem, $main.firstChild);

        const $mainWindow = document.querySelector('div.cp-main-data-0ea9e2d3');
        $mainWindow.style.width = WINDOW_WIDTH;

        __dragElement($mainWindow, document.querySelector('header.cp-header-dd32fa6e'));

        $mainWindow.style.left = window.innerWidth - $twitchChatBlock.clientWidth - ($mainWindow.clientWidth || WINDOW_WIDTH) + 'px';
        $mainWindow.style.top = window.innerHeight / 2 + 'px';

        loaded = true;

    } catch (e) { void console.error(e) }

}

function createScript(src, settings = { append: true, appendTo: document.head }) {
    let script = document.createElement('script');
    // script.setAttribute('defer', 'true');
    script.src = src;
    script.async = true;
    if (settings.append) {
        settings.appendTo.appendChild(script);
    }

    return script;
}

function __dragElement(elmnt, header) {
    // TODO: bad practice
    /* 
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
*/
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }


    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.oncontextmenu = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        elmnt.offsetBottom = elmnt.offsetTop - window.innerHeight + elmnt.offsetHeight;
        elmnt.offsetRight = elmnt.offsetLeft - window.innerWidth + elmnt.offsetWidth;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // console.log(pos4, elmnt.offsetTop, pos3, elmnt.offsetLeft)
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.offsetTop < 10
            ? (elmnt.style.top = '10px')
            : elmnt.offsetBottom > -10
                ? (elmnt.style.top = window.innerHeight - elmnt.offsetHeight - 10 + 'px')
                : elmnt.offsetLeft < 10
                    ? (elmnt.style.left = '10px')
                    : elmnt.offsetRight > -10
                        ? (elmnt.style.left = window.innerWidth - elmnt.offsetWidth - 10 + 'px')
                        : void 0;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addOpenBtn(el, to, before) {
    let animIndex = 0, animTxt = '\\|/-';
    const animInterval = setInterval(() => {
        if (el.innerHTML.length > 1) {
            return clearInterval(animInterval);
        }
        if (document.querySelectorAll('button#' + el.id).length > 1) {
            el.remove();
            return clearInterval(animInterval);
        }

        el.innerHTML = animTxt[animIndex++ % animTxt.length]
    }, 300)

    el.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';
    to.insertBefore(el, before);
    el.setAttribute('onclick', '__MAIN__.openMainWindow()');
}
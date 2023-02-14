var loaded = false;

const createScript = (src) => {
    let script = document.createElement('script');
    script.setAttribute('defer', 'defer');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);

    return script;
}

const $style = document.createElement('style');
$style.innerHTML = css;
document.head.append($style);

with (browser.runtime) {
    createScript(getURL('alpine/alpine.min.js'));
    createScript(getURL('alpine/persist.js'));
    createScript(getURL('script.js'));
}

var oldHref = document.location.href;

window.onanimationstart = function () {
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                if (loaded) { loaded = false; }
                oldHref = document.location.href;
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};

window.onanimationend = async function () {
    if (loaded) return;
    loaded = true;
    try {

        // const $main = document.querySelector('.Layout-sc-1xcs6mc-0.dajtya');
        const $main = document.querySelector('div#root');
        const $elem = document.createElement('div');
        const $underChatGUI = document.querySelector('.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > .Layout-sc-1xcs6mc-0.hOyRCN');
        const $settingsBtn = $underChatGUI.firstChild;
        const $openButton = document.createElement('button');
        const $twitchChatBlock = document.querySelector('.Layout-sc-1xcs6mc-0.fLaIqI')

        var animIndex = 0, animTxt = '\\|/-';

        const animInterval = setInterval(() => {
            if ($openButton.innerHTML.length > 10) return clearInterval(animInterval);
            $openButton.innerHTML = animTxt[animIndex++ % animTxt.length]
        }, 300)
        $openButton.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';

        $underChatGUI.insertBefore($openButton, $settingsBtn)

        $elem.innerHTML = MAIN_HTML;

        $main.insertBefore($elem, $main.firstChild);

        const $mainWindow = document.querySelector('div.cp-main-data-0ea9e2d3');

        __dragElement($mainWindow, document.querySelector('header.cp-header-dd32fa6e'));

        console.log(window.innerWidth - $twitchChatBlock.clientWidth - $mainWindow.clientWidth)
        console.log($mainWindow)
        $mainWindow.style.left = window.innerWidth - $twitchChatBlock.clientWidth - ($mainWindow.clientWidth || 460) + 'px';
        $mainWindow.style.top = window.innerHeight / 2 + 'px';

    } catch (e) { void console.error(e) }

}

function __dragElement(elmnt, header) {
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
            : elmnt.offsetBottom > -2
                ? (elmnt.style.top = window.innerHeight - elmnt.offsetHeight - 10 + 'px')
                : elmnt.offsetLeft < 2
                    ? (elmnt.style.left = '10px')
                    : elmnt.offsetRight > -2
                        ? (elmnt.style.left = window.innerWidth - elmnt.offsetWidth - 10 + 'px')
                        : void 0;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
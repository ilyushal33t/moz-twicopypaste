var loaded = false;

const createScript = (src) => {
    let script = document.createElement('script');
    script.setAttribute('defer', 'defer');
    script.src = src;
    document.head.appendChild(script);

    return script;
}

const $style = document.createElement('style');
$style.innerHTML = css;
document.head.append($style);

with (browser.runtime) {
    createScript(getURL('alpine/alpine.min.js'));
    createScript(getURL('alpine/persist.js'));

    var MAINJS = createScript(getURL('script.js'));

    // MAINJS.onload = async function () {
    //     await new Promise(r => setTimeout(r, 1e3));
    //     alert('asd')
    //     alert(window.__createEmote('1984', 'https://cdn.7tv.app/emote/60b2654203982475b83b1346/1x.webp'))
    // };
}

window.onanimationend = async function () {
    if (loaded) return;
    loaded = true;

    // const $main = document.querySelector('.Layout-sc-1xcs6mc-0.dajtya');
    const $main = document.querySelector('div#root');
    const $elem = document.createElement('div');
    const $underChatGUI = document.querySelector('.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > .Layout-sc-1xcs6mc-0.hOyRCN');
    const $settingsBtn = $underChatGUI.firstChild;
    const $openButton = document.createElement('button');

    $openButton.innerHTML = 'loading';
    $openButton.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';

    $underChatGUI.insertBefore($openButton, $settingsBtn)

    $elem.innerHTML = `
      <div x-show="_mainWindowShow__" x-data="_main_" x-cloak class="cp-main-data-0ea9e2d3">
        <div class="cp-main-c4898d02">
            <header class="cp-header-dd32fa6e">
                <div @click="settingsModalShow=!0" class="cp-settings-a3243b52">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="cp-settings-svg-a8b1f124">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                5Header
                <div @click="_closeMain__" class="cp-close-a3243b52">
                    <svg xmlns=" http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="cp-close-svg-a8b1f124">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </header>
            <div class="cp-content-11af01d1">
                <div class="textarea-block-f382e8ac">
                    <label for="cp-area-bee11b14">Enter your pasta to save.</label>
                    <textarea spellcheck="false" maxlength="500" x-ref="textarea" class="cp-area-bee11b14"
                        name="cp-area-bee11b14" id="cp-area-bee11b14" placeholder="type here..."></textarea>
                    <input
                        @click="await savePasta({msg:$refs.textarea.value,name:$refs.pastaName.value}, $refs.username.value) ? log('added to ' + $refs.username.value.toLowerCase()) : alert('user with this name does not exist.')"
                        class="input-button-4a3582a6" type="button" value="Send" />
                </div>
                <div class="info-block-82670232">
                    <div>
                        <label for="username">Channel name</label>
                        <input x-ref="username" name="username" class="input-text-4a3582a6" type="text" required />
                    </div>
                    <div>
                        <label for="pasta-name">Your pasta name</label>
                        <input x-ref="pastaName" name="pasta-name" class="input-text-4a3582a6" type="text" required />
                    </div>
                </div>
            </div>
            <footer class="cp-footer-e3165e9d" x-data="list">
                <template x-for="s in streamers" :key="s">
                    <div x-data="{uid:generateUID()}">
                        <div @click="select(s)" class="cp-list-72648db7" :id="uid">
                            <div class="cp-close-a3243b52" style="right: 15px; opacity: .5;">
                                <svg @click="deleteStreamer(s, uid)" xmlns=" http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="cp-close-svg-a8b1f124">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span :id="uid" x-text="s">

                            </span>
                            <div class="cp-arrow-svg-b6bb2e7a">
                                <svg :class="{'rotate-90': active == s}" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                        <div class="data-container-673efd75">
                            <template x-data="emotes" x-for="ctx in context[active]">
                                <div x-show="active == s" style="position: relative;">
                                    <h2 x-text="ctx.name" class="cp-p-name-115e56dc"></h2>
                                    <div @click="await saveToClipboard(ctx.msg)" x-bind="_savePasta_"
                                        class="cp-msg-preview-8ee8c5b1">
                                        <div class="user_container_087b8fa9"><span class="username_preview_37582eb4"
                                                x-text="$store.settings.username.val"></span><span
                                                style="margin-right: 3px;">:</span>
                                        </div><span class="emote_container_2fdf6c3d"
                                            x-html="parseEmotes(ctx.msg, active)"></span>
                                    </div>
                                    <div class="cp-close-a3243b52" @click="deletePasta(active, ctx.uid, uid)">
                                        <svg xmlns=" http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="cp-close-svg-a8b1f124">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <br>
                                    <hr>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </footer>
            <div id="saved-success-e48392b4" x-show="saved">
                saved
            </div>
        </div>

        <template x-teleport="body">
            <div x-show="settingsModalShow" x-cloak class="modal-over-4a348d16">

                <div x-show="settingsModalShow" @click.outside="settingsModalShow=!1" class="modal-body-50cb404c"
                    x-transition:leave>
                    <header class="modal-head-4a348d16">
                        <h2>Settings</h2>
                    </header>
                    <main class="modal-content-4a348d16">
                        <template x-for="[key, val] in Object.entries(settings)">
                            <template x-if="val.workingStatus">
                                <div>
                                    <span x-text="key + ':'"></span>
                                    <input :name="key" class="settings-input-031f6120" :type="val.type"
                                        :value="val.val">
                                </div>
                            </template>
                        </template>
                    </main>
                    <footer class="modal-footer-4a348d16">
                        <button @click="modalSettingsSave" class="cp-btn cp-btn-modal-save">
                            Save
                        </button>
                        <button @click="settingsModalShow=!1" class="cp-btn cp-btn-modal-close">
                            Close
                        </button>
                    </footer>
                </div>
            </div>
        </template>
    </div>`.slice(1);

    $main.insertBefore($elem, $main.firstChild);

    __dragElement(document.querySelector('div.cp-main-data-0ea9e2d3'), document.querySelector('header.cp-header-dd32fa6e'));

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
        elmnt.offsetTop < 10
            ? (elmnt.style.top = '10px')
            : elmnt.offsetBottom > -2
                ? (elmnt.style.top = window.innerHeight - elmnt.offsetHeight - 10 + 'px')
                : elmnt.offsetLeft < 2
                    ? (elmnt.style.left = '10px')
                    : elmnt.offsetRight > -2
                        ? (elmnt.style.left = window.innerWidth - elmnt.offsetWidth - 10 + 'px')
                        : void 0;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
var loaded = false;
window.onanimationend = async function () {
    if (loaded) return;
    loaded = true;
    const $main = document.querySelector('.Layout-sc-1xcs6mc-0.dajtya');
    const $elem = document.createElement('div');
    const $style = document.createElement('style');
    $elem.innerHTML = `
    <div x-data="{open:1}" class="cp-main-data-0ea9e2d3">
        <div class="cp-main-c4898d02">
            <header class="cp-header-dd32fa6e">
                5Header
                <div class="cp-close-a3243b52">
                    <svg xmlns=" http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="cp-close-svg-a8b1f124">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </header>
            <div class="cp-content-11af01d1">
                <label for="cp-area-bee11b14">Enter your paste to save.</label>
                <textarea class="cp-area-bee11b14" name="cp-area-bee11b14" id="cp-area-bee11b14"
                    placeholder="type here...">
                </textarea>
            </div>
            <footer class="cp-footer-e3165e9d" x-data="list">
                <template x-for="s in streamers">
                    <div>
                        <div @click="select(s)" class="cp-list-72648db7">
                            <span x-text="s">

                            </span>
                            <svg :class="{'rotate-90': active == s}" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="cp-arrow-svg-b6bb2e7a">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                        <template x-for="ctx in context[active]">
                            <div x-show="active == s">
                                <h2 x-transition:enter x-text="ctx.name" class="cp-p-name-115e56dc"></h2>
                                <div x-transition:enter x-html="ctx.p" class="cp-msg-preview-8ee8c5b1">
                                </div>
                                <br>
                                <hr>
                            </div>
                        </template>
                    </div>
                </template>
            </footer>
        </div>
    </div>
    `;

    $style.innerHTML = css;
    document.head.append($style);
    $main.insertBefore($elem, $main.firstChild);

    const input = document.querySelector('#myInput');
    const container = document.querySelector('#container')
    const list = document.querySelector('ul');
    const submit = document.querySelector('#add_button')
    const __emotes = {};


    dragElement(container);



    input.oninput = function () {
        // console.log(input.value)
    }

    submit.onclick = function () {
        let li = document.createElement('li');
        li.innerHTML = input.value//input.value.replace(_regexp, e => _$.createEmote(e, allEmotes.find(a => a.name == e).image1x));
        //window.twemoji.parse(li);
        list.insertBefore(li, list.firstChild);
    }

    function dragElement(elmnt) {
        /* 
            https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
        */
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
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

}
const CSS = `:root {
    --color-main: #efeff1;
    --bg-dark: #131313;
    --bg-main: #1b1c20;
    --z-index: 9999999;
    --tw-violet: rgba(138, 100, 226, 0.7);
    --success-color: rgba(71, 199, 135, 0.9);
    --error-color: rgba(233, 78, 78, 0.9);
    --main-content-padding: 14px;
    --main-window-width: calc(520px + var(--main-content-padding) * 2);
    --main-max-height: 500px;
    --textarea-padding: 4px;
    --info-block-width: 130px;
    --emotes-block-width: 300px;
    --emotes-block-left: -324px;
    --emotes-block-height: 300px;
}


[x-cloak] {
    display: none !important;
}

body {
    font-family: "Inter", "Roobert", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#cp-area-bee11b14:focus,
.cp-main-data-0ea9e2d3>input {
    outline: none;
}

/* body {
    margin: 0;
    padding: 0;
} */

.cp-main-data-0ea9e2d3 {
    position: absolute;
    z-index: var(--z-index);
}

.cp-area-bee11b14,
.input {
    /* mt-2 resize-v bg-[rgba(33,33,33,.8)] w-[250px] max-h-[80px] min-h-[30px] text-white/90 text-sm p-2 */
    margin-top: 8px;
    border: 0px;
    text-decoration: none;
    resize: vertical;
    background-color: rgba(39, 38, 38, 0.8);
    width: 250px;
    max-height: 80px;
    min-height: 40px;
    padding: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, .9);
}
.input.func {
    min-width:50px!important;
    max-width:99.99%!important;
    transition: width 0.25s;
    text-align:center;
}

.search-by-pastaname-input-14a50f55,
.settings-input-031f6120 {
    min-height: 12px;
    max-height: 12px;
}

svg {
    cursor: pointer;
}

.settings-input-031f6120,
.early-preview-input-031f6120 {
    width: auto;
}

.modal-over-4a348d16 {
    /* flex justify-center items-center fixed left-0 top-0 right-0 bottom-0 z-20 bg-black/50 */
    position: fixed;
    color: var(--color-main);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: calc(var(--z-index) + 1);
    justify-content: center;
    align-items: center;
    background-color: rgba(39, 38, 38, 0.8);
}

.cp-emotes-block-ee94efc2 {
    z-index: calc(var(--z-index) + 1);
    position: absolute;
    width: var(--emotes-block-width);
    height: var(--emotes-block-height);
    background-color: var(--bg-main);
    left: var(--emotes-block-left);
    border: 1px solid #131313;
    padding: 12px;
}

.modal-head-4a348d16,
.modal-content-4a348d16,
.modal-footer-4a348d16,
.ctx-menu-body-50cb404c,
.ctx-menu-content-4a348d16 {
    /* py-2 px-4 text-lg font-semibold bg-gray-200 */
    padding: 12px;
    font-size: 12px;
    font-weight: 400;
    background-color: #1b1c20;
    max-width: 400px;
}

.modal-body-50cb404c {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
}

.ctx-menu-body-50cb404c {
    z-index: calc(var(--z-index) + 1);
    display: block;
    position: absolute;
    right: 5px;
    top: 30px;
    max-width: 100%;
    border: 1px solid rgba(255, 255,255,.4);
}

.ctx-menu-content-4a348d16 {
    padding: 0;
    max-width: 100%;
}

.settings-input-0950937f {
    max-width: 28px;
    max-height: 28px;
}

.modal-footer-4a348d16 {
    /* py-2 px-4 text-lg flex justify-end font-semibold bg-gray-200 */
    display: flex;
    justify-content: flex-end;
    align-items: center;
}


.modal-4a348d16 {
    color: var(--color-main);
    padding: 8px;
    position: fixed;
    z-index: 999999999;
    justify-content: center;
    align-items: center;
    background-color: #1b1c20;
    width: 400px;
    max-height: 600px;
    min-height: 200px;
    overflow: auto;
}

.textarea-block-f382e8ac {
    padding: 4px;
}

.cp-msg-preview-8ee8c5b1 {
    /* p-2 bg-[#292d33] w-[340px] ml-[20px] */
    width: 354px;
    background-color: var(--bg-dark);
    margin-left: 8px;
    word-wrap: break-word;
    /* white-space: pre; */
    font-weight: 400;
    line-height: 20px;
    overflow-wrap: anywhere;
    vertical-align: baseline;
    font-stretch: 100%;
    font-size: 13px;
    border-image-width: 1;
    border-image-slice: 100%;
    box-sizing: border-box;
    font-kerning: auto;
    padding: .5rem 2rem;
    /* display: inline-flex; */
}

.cp-msg-preview-8ee8c5b1.live-preview {
    margin-left: 0px !important;
    width: 340px !important;
}

label {
    font-size: 12px;
}

.absolute {
    position: absolute !important;
}

.cp-main-c4898d02 {
    /* relative w-[400px] text-[#EFEFF1] text-sm */
    position: relative;
    width: var(--main-window-width);
    color: var(--color-main);
    font-size: 14px;
}

.cp-main-content-39f3d0d7 {
    max-height: var(--main-max-height);
    overflow: auto;
    padding: var(--main-content-padding);
    background-color: var(--bg-main);
}

.cp-btn {
    background-color: #292929;
    /* Green */
    border: none;
    color: white;
    padding: 4px 7px;
    margin: 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
}

.cp-btn-modal-save:hover {
    background-color: var(--tw-violet)
}

.cp-btn-modal-close:hover {
    background-color: rgba(201, 79, 79, 0.7)
}

.cp-header-dd32fa6e {
    /* cursor-pointer p-1 bg-[#1a1d24] flex justify-center */
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
    padding: 4px;
    background-color: var(--bg-main);
    display: flex;
    justify-content: center;
}

.cp-close-a3243b52,
.cp-settings-a3243b52 {
    /* absolute right-0 top-0 p-2 hover:text-red-300 transition-all */
    box-sizing: content-box;
    padding: 8px;
    position: absolute;
    top: 0;
    right: 0;
    transition: all;
}

.cp-settings-a3243b52 {
    left: 0 !important;
}

.cp-close-a3243b52:hover {
    color: rgba(207, 86, 86, .7);
}

.cp-content-11af01d1 {
    /* bg-[#292d33] p-3 border-x-4 border-[#1a1d24] */
    background-color: var(--bg-main);
    padding: 12px;
}

.inline-flex {
    display: inline-flex;
}

.cp-footer-e3165e9d {
    /* bg-[#1a1d24] p-3 */
    background-color: var(--bg-main);
    padding: 12px;
}

#saved-success-e48392b4,
#error-msg-e48392b4 {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--success-color);
}

#error-msg-e48392b4 {
    background-color: var(--error-color);
}

.cp-list-72648db7 {
    /* flex justify-between py-1 px-2 border border-[#292d33] cursor-pointer hover:text-blue-400 font-bold */
    display: flex;
    position: relative;
    justify-content: space-between;
    padding: 4px 8px;
    border-bottom: 1px solid var(--bg-dark);
    font: bold;
    cursor: pointer;
}

.cp-close-svg-a8b1f124,
.cp-arrow-svg-b6bb2e7a,
.cp-settings-a3243b52 {
    width: 16px;
    height: 16px;
}

.cp-arrow-svg-b6bb2e7a {
    margin-top: 4px;
    transition: all .3s ease;
}

.cp-list-72648db7:hover {
    color: var(--tw-violet)
}

.rotate-90 {
    transform: rotate(90deg);
}

.cp-p-name-115e56dc {
    /* p-2 flex justify-center text-md */
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: medium;
    font-weight: bold;
}

.data-container-673efd75 {
    max-height: 300px;
    overflow-y: auto;
}

.emote_container_2fdf6c3d {
    position: relative;
    min-height: 15px;
    margin: 0px;
    padding: 0px;
}

.emote_container_2fdf6c3d:first-child {
    margin-right: .25em;
}

.emote_container_2fdf6c3d.b253c65b {
    min-width: 28px;
    display: inline-block;
}

.user_container_087b8fa9 {
    display: inline-block !important;
}

.username_preview_37582eb4 {
    color: rgba(71, 199, 135, 0.7)
}

.emote_container_2fdf6c3d>span>img {
    position: absolute;
    top: -5px;
}

.info-block-82670232 {
    width: calc(var(--info-block-width) - var(--textarea-padding));
    padding: 10px;
    margin-bottom: 10px;
    border-right: .5px solid var(--bg-dark)
}

.info-block-82670232 label {
    font-size: 10px;
}

.input-text-4a3582a6,
.input-button-4a3582a6 {
    width: 100px;
    font-size: 12px;
    min-height: 0;
    margin-bottom: 10px;
    padding: 4px;
}

.input-button-4a3582a6 {
    border: 1px solid var(--bg-main);
    cursor: pointer;
    max-height: 50px !important;
    transition: all ease-in-out .75ms;
}

.input.func:focus {
    outline: none;
}

.input-button-4a3582a6:hover,
.input-button-4a3582a6:focus {
    background-color: #9146ff;
    color: rgb(216, 200, 255);
    border: 1px solid rgba(138, 100, 226, 0.7);
}`;
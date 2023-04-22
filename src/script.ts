//TODO: more settings, user interactive functions, fav emotes[?] live-preview fix, search by pastas names
//Alpine version 3.11.1

const DEBUG = false;
const LOCAL_DEBUG = document.location.host !== 'www.twitch.tv';
const API_URL = new class {
    public URL = 'https://tw-emotes-api.onrender.com';
    public globalEmotes = this.URL + '/globalemotes';
    public channel = this.URL + '/user';
    public channelEmotes = this.URL + '/useremotes';
    public fullUser = this.URL + '/full_user';
};
const DEFAULT_SETTINGS = {
    username: {
        name: 'Your username',
        help: 'Change username you want to see examples from.',
        type: 'text',
        val: 'c00ln1ckl33t',
        workingStatus: true,
    },
    savePastaMethod: {
        name: 'Clipboard save method',
        help: 'Method you want to save pasta to clipboard.',
        type: 'select',
        val: 'click',
        workingStatus: false,
    },
    theme: {
        name: 'Theme',
        help: 'Change extension theme',
        type: 'select',
        val: 'dark',
        workingStatus: false,
    },
    copyPastaBtnEmote: {
        name: 'Open button emote',
        help: 'Write an emote name if this emote is available from someone\'s streamer you added, or paste 7tv or betterttv URL to emote (cdn / emote page).',
        type: 'text',
        val: 'https://7tv.app/emotes/63438a743d1bc89e0ff9e400',
        workingStatus: true,
    },
};
const DEFAULT_PASTAS_DATA: PastasData = {
    streamers: [],
    context: {},
};
const ERROR_EMOTES = [
    'https://7tv.app/emotes/638507a9fed40bb16636c6ac',
    'https://7tv.app/emotes/6151c1de43b2d9da0d32adf9',
    'https://7tv.app/emotes/61774bcae0801fb98787f5a5',
    'https://7tv.app/emotes/63c01677567c38e1a0ec8ab2',
    'https://7tv.app/emotes/625f1b0598a6c8cc55577855',
    'https://7tv.app/emotes/6299cf3347051898ec04cd6c',
];
const FUNCTIONS = {
    fill: {
        help: 'Paste message {x} times.',
        props: {
            x: 6,
        },
        func: function (msg: string, conf: { x: number }) {
            if (msg.length > 499) return msg;
            return (msg.endsWith(' ') ? msg.repeat(conf.x) : (msg + ' ').repeat(conf.x)).slice(0, 500)
        },
    },
    shuffle: {
        help: 'Pastes each word {x} times',
        props: {
            x: 4,
        },
        func: function (msg: string, conf: { len: number, x: number }): string {
            if (msg.length > 499) return msg;
            msg = msg.trim();
            if (!msg.length) return '';
            let out = '',
                fill: string[];
            fill = msg.split(` `);
            out = fill.map(e => (e + ' ').repeat(conf.x)).join(' ');

            return out.slice(0, 500);
        }
    },
    shuffleInvisibleChar: {
        help: 'Shuffle invisible character with message',
        props: {
            len: 150,
            charLen: 8,
            rand: 1,
        },
        func: function (msg: string, conf: { len: number, charLen: number, rand: boolean }): string {
            if (msg.length > 499) return msg;
            msg = msg.trim();
            if (!msg.length) return '';
            let out = '',
                fill: string[],
                invisibleChar = String.fromCharCode(10240),
                len = conf?.len || 150;
            if (msg.includes(invisibleChar)) {
                msg = msg.replace(new RegExp(invisibleChar, 'g'), '').trim();
            }
            if (!conf.rand) {
                invisibleChar = invisibleChar.repeat(conf.charLen || 8);
                fill = msg.split(` `);
                do {
                    out += fill[randNumb(fill.length)] + ' ' + invisibleChar + ' ';
                } while (out.length <= len)
                return out;
            } else {
                fill = msg.split(` `);
                do {
                    out += fill[randNumb(fill.length)] + ' ' + invisibleChar.repeat(randNumb(12, 4)) + ' ';
                } while (out.length <= len)
                return out.slice(0, 500);
            }
        },
    },
}

document.addEventListener('alpine:init', async function () {

    Alpine.data('_main_', function (this: any) {
        return {
            // local storage variables
            settings: this.$persist(this.$store.settings || DEFAULT_SETTINGS),
            pastasData: this.$persist(this.$store.pastasData || DEFAULT_PASTAS_DATA) as PastasData,
            selFunc: this.$persist({
                SELECTED: 'shuffleInvisibleChar',
                FUNCTIONS: FUNCTIONS,
            }) as string,
            // booleans
            settingsModalShow: false as boolean,
            mainWindowShow: DEBUG as boolean,
            emotesMenuShow: false as boolean,
            saved: false as boolean,
            error: false as boolean,
            functionsSettingsShow: false as boolean,
            streamerExists: true as boolean,

            errorMsg: null as null | string,
            //models
            streamerModel: LOCAL_DEBUG ? 'forsen' : document.location.pathname.slice(1).replace(/\/.*/g, '') as string,
            textareaModel: '' as string,
            searchByPastaModel: '' as string,

            init() {

                let settingsKeys = Object.keys(this.settings);
                let defaultSettingsKeys = Object.keys(DEFAULT_SETTINGS);

                let defaultFuncs = Object.keys(FUNCTIONS);
                let funcs = Object.keys(this.selFunc.FUNCTIONS);


                if (!defaultSettingsKeys.every(key => settingsKeys.includes(key))) {
                    defaultSettingsKeys.forEach(key => {
                        if (!this.settings[key]) {
                            log(key + ' was added after update')
                            this.settings[key] = DEFAULT_SETTINGS[key];
                        }
                    })
                } else if (!settingsKeys.every(key => defaultSettingsKeys.includes(key))) {
                    settingsKeys.forEach(key => {
                        if (!DEFAULT_SETTINGS[key]) {
                            log(key + ' was deleted after update')
                            delete this.settings[key];
                        }
                    });
                };
                if (
                    defaultFuncs.length !== funcs.length
                ) {
                    defaultFuncs.forEach(func => {
                        if (!funcs.includes(func)) {
                            console.log(func)
                            this.selFunc.FUNCTIONS[func] = FUNCTIONS[func];
                        }
                    })
                }


                Alpine.store('settings', this.settings);
                Alpine.store('pastasData', this.pastasData);

                globalThis.__MAIN__ = this;

                log('inited');

                document.querySelector('.cp-main-content-39f3d0d7').addEventListener('scroll', (e) => {
                    this.functionsSettingsShow = false;
                });
            },
            searchRegExp(): RegExp {
                return new RegExp(this.searchByPastaModel, 'gmi')
            },
            async isLoadingEmotes(): Promise<void> {
                if (this.streamerExists) {
                    let tempEmotes: EmotesData[] = await (new FetchAllEmotesData(this.$store)).loadTempEmotes(this.streamerModel);
                    tempEmotes = [].concat(...Object.values(tempEmotes));
                    let _regexpTempEmotes = new RegExp(
                        tempEmotes.map((e) => e.name.__createEmoteRegExp()).join('|')
                        , 'g'
                    )
                    if (_regexpTempEmotes.source === '(?:)') _regexpTempEmotes = /\b\B/;
                    globalThis.tmpEmotes = { emoteData: tempEmotes, emoteRegex: _regexpTempEmotes }
                } else this.showError('User with this name does not exist. You should provide real logins to save.');
                return;
            },
            async savePasta(pasta: { name: string, msg: string }, streamer: string, livePreview: string) {
                try {
                    if (!pasta.msg.trim() || !streamer.trim()) {
                        this.showError('No pasta or streamer found.');
                        return false;
                    }
                    pasta.msg = pasta.msg.trim().replace(/\n/g, ' ');
                    streamer = streamer.toLowerCase();
                    if (this.pastasData.streamers.includes(streamer) || await this.twitchUserExists(streamer)) {
                        if (!pasta.name.trim())
                            pasta.name = pasta.msg.trim().split(` `)[0].slice(0, 32);

                        if (!this.pastasData.streamers.includes(streamer)) {
                            this.pastasData.streamers.push(streamer);
                            globalThis.__EMOTES__.init();
                        }
                        function save_(pasta: { name: string, msg: string }) {
                            return {
                                name: pasta.name,
                                msg: pasta.msg,
                                uid: generateUID(),
                            }
                        }
                        this.pastasData.context[streamer]
                            ? this.pastasData.context[streamer].push(save_(pasta))
                            : this.pastasData.context[streamer] = [save_(pasta)];

                        this.showSaved();
                    }
                    else {
                        this.showError('User with this name does not exist. You should provide real logins to save.')
                        return false;
                    }
                } catch (e) {
                    log.error(e);
                    this.showError(e)
                }
                this.textareaModel = '';
                return true;
            },
            modalSettingsSave(): void {
                this.settingsModalShow = false;
                let settings = document.querySelectorAll('input.settings-input-031f6120') as NodeListOf<HTMLInputElement>;
                Array.from(settings)
                    .forEach(el => {
                        this.settings[el.name].val = el.value;
                    });

                globalThis.__EMOTES__.changeBtnEmote(this);
                this.showSaved();
            },
            showSaved(): void {
                this.saved = true;
                setTimeout(() => {
                    this.saved = false;
                }, 2e3);
            },
            showError(err: string): void {
                this.error = true;
                this.errorMsg = err;
                setTimeout(() => {
                    this.error = false;
                    this.errorMsg = null;
                }, 5e3);
            },
            openMainWindow(): void {
                this.mainWindowShow = !this.mainWindowShow;
            },
            openFunctionsSettings(): void {
                this.functionsSettingsShow = !this.functionsSettingsShow;
            },
            deletePasta(streamer: string, uid: string): void {
                let ctx = this.pastasData.context[streamer];
                if (this.pastasData.context[streamer].length < 2) {
                    this.deleteStreamer(streamer);
                }
                else {
                    ifDebug(console.time, 'splice data');
                    this.pastasData.context[streamer].splice(ctx.map(e => e.uid).indexOf(uid), 1);
                    ifDebug(console.timeEnd, 'splice data');
                }

            },
            deleteStreamer(streamer: string, pr: boolean = false): boolean {
                if (!pr) {
                    let startTime = new Date().getTime();
                    pr = confirm('Are you sure you want to delete this streamer and pastas for him?');
                    let endTime = new Date().getTime();
                    if (endTime - startTime < 50) pr = true;
                }
                if (pr) {
                    this.pastasData.streamers.splice(this.pastasData.streamers.indexOf(streamer), 1)
                    delete this.pastasData.context[streamer];
                }
                return pr;
            },
            async saveToClipboard(msg: string): Promise<void> {
                await navigator.clipboard.writeText(msg);
                this.showSaved();
            },
            async twitchUserExists(streamer: string): Promise<boolean> {
                let url = `https://tw-emotes-api.onrender.com/user?name=${streamer}`;
                try {
                    this.streamerExists = !(await (await fetch(url)).json()).error

                    return this.streamerExists;
                } catch (err) { log.error(err); }
            },
            _binds_: {
                textarea: {
                    spellcheck: false,
                    maxlength: 500,
                    'x-ref': "textarea",
                    'x-model.debounce': "textareaModel",
                    class: "cp-area-bee11b14",
                    name: "cp-area-bee11b14",
                    id: "cp-area-bee11b14",
                    'x-init': "$el.addEventListener('keyup',e=>{e.preventDefault();let{shiftKey:s,ctrlKey:c,altKey:a,keyCode:k}=e;if([s,c,a].every(e=>e==0)&&k==13)($refs.saveBtn.click(),$el.value='')})",
                    placeholder: "type here...",
                },
                searchByPastaname: {
                    spellcheck: false,
                    'x-model.debounce': "searchByPastaModel",
                }
            }
        }
    });

    Alpine.data('list', function () {
        return {
            streamers: this.$store.pastasData.streamers,
            context: this.$store.pastasData.context,
            active: null,
            select(item: string): void {
                if (this.active == item) {
                    this.active = null;
                    return;
                }
                this.active = item;
            }
        }
    });

    Alpine.data('emotes', function () {
        return {
            async init(): Promise<void> {

                globalThis.__EMOTES__ = this;

                await this.fetchData();

                if (!this.loading) {
                    this.$dispatch('emotes-loaded', this);
                    globalThis._ALL_EMOTES_REGEXP_ = this._ALL_EMOTES_REGEXP_
                    globalThis._ALL_EMOTES_ = this._ALL_EMOTES_;
                    this.changeBtnEmote(this);
                }
            },
            async fetchData(): Promise<void> {
                if (!this.loading) {
                    this.loading = true;

                    Object.assign(this, await new FetchAllEmotesData(this.$store)._get())

                    log('emotes loaded.');
                    this.loading = false;
                    return;
                }
            },
            changeBtnEmote(self: any): Element | Error {
                const $copyPastaBtn: Element | Error = document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca') ?? document.createElement('button');
                let btnEmote: string | Error, $underChatGUI: Element = document.querySelector('.Layout-sc-1xcs6mc-0.XTygj.chat-input__buttons-container > .Layout-sc-1xcs6mc-0.hOyRCN');

                if (!($copyPastaBtn?.parentElement?.className == 'Layout-sc-1xcs6mc-0 hOyRCN') || LOCAL_DEBUG) {
                    $copyPastaBtn.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';
                    LOCAL_DEBUG
                        ? document.body.appendChild($copyPastaBtn)
                        : $underChatGUI.insertBefore($copyPastaBtn, $underChatGUI.firstChild)
                }

                document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca')?.removeAttribute('onclick');

                const $newCopyPastaBtn = $copyPastaBtn.cloneNode(true);

                let open = () => globalThis.__MAIN__.openMainWindow()

                $newCopyPastaBtn.addEventListener('click', open);
                $copyPastaBtn.parentNode.insertBefore($newCopyPastaBtn, $copyPastaBtn);
                $copyPastaBtn.remove();

                try {
                    btnEmote = check7TV_BTTV(self.$store.settings.copyPastaBtnEmote.val);
                } catch (e) {
                    const emoteName = self.$store.settings.copyPastaBtnEmote.val;
                    btnEmote = emoteName.__parseEmote(globalThis._ALL_EMOTES_REGEXP_, globalThis._ALL_EMOTES_);

                    if (btnEmote == emoteName) {
                        const err = 'invalid URL or this emote is not available';
                        self.showError(err);
                        log.error(err);
                        self.$store.settings.copyPastaBtnEmote.val = btnEmote = ERROR_EMOTES[randNumb(ERROR_EMOTES.length)];
                        btnEmote = check7TV_BTTV(btnEmote);
                    }
                }
                if ($newCopyPastaBtn instanceof Element && typeof btnEmote == 'string') {
                    $newCopyPastaBtn.innerHTML = btnEmote;
                }


                return $newCopyPastaBtn as Element;
            },
            createEmote: globalThis.__createEmote,
            parseEmotes(msg: string, streamer: string, conf = { tmp: false, url: false }): string {
                ifDebug(log, msg, streamer, conf)
                if (!msg) return;
                try {
                    if (conf.url) {
                        return check7TV_BTTV(msg) as string;
                    }

                    if (msg.slice(-1) != ' ')
                        msg += ' ';

                    if (this.loading) {
                        return msg;
                    }

                    msg = msg.replace(/(\<[a-z]{1}|\<\/)/gmi, e => [...e].join('&#13;'));
                    msg = msg.trim().replace(/\n/g, ' ') + ' ';

                    if (conf.tmp && !this.$store.pastasData.streamers.includes(streamer) && globalThis.__MAIN__.streamerExists)
                        return msg
                            .__parseEmotes(
                                this._regexpGlobalEmotes, this.allGlobalEmotes,
                                globalThis?.tmpEmotes?.emoteRegex, globalThis?.tmpEmotes?.emoteData
                            );

                    else if (streamer == void 0 || !this.$store.pastasData.streamers.includes(streamer))
                        return msg
                            .__parseEmotes(this._regexpGlobalEmotes, this.allGlobalEmotes);

                    return msg
                        .__parseEmotes(
                            this._regexpGlobalEmotes, this.allGlobalEmotes,
                            this._regexpChannelEmotes[streamer], this.channelsEmotesObj[streamer]
                        );

                } catch (e) { log.error(e) };
            }
        }
    });

});
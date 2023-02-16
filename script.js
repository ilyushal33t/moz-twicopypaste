//TODO: more settings, user interactive functions, fav emotes[?] live-preview fix, search by pastas names
const DEBUG = false;
const LOCAL_DEBUG = document.location.host != 'www.twitch.tv';
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
        help: 'Method you want to save pasta to clipboard. Currently is ' + this.val,
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
        val: 'NaM',
        workingStatus: true,
    },
};
const DEFAULT_PASTAS_DATA = {
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

log.error = console.error;

document.addEventListener('alpine:init', async function () {

    Alpine.data('_main_', function () {
        return {
            log: log,
            settings: this.$persist(this.$store.settings || DEFAULT_SETTINGS),
            pastasData: this.$persist(this.$store.pastasData || DEFAULT_PASTAS_DATA),
            settingsModalShow: false,
            _mainWindowShow__: DEBUG,
            saved: false,
            error: false,
            errorMsg: null,
            currentLocation: LOCAL_DEBUG ? 'forsen' : document.location.pathname.slice(1),
            init() {
                let settingsKeys = Object.keys(this.settings);
                let __defaultSettingsKeys = Object.keys(DEFAULT_SETTINGS);
                if (!__defaultSettingsKeys.every(key => settingsKeys.includes(key))) {
                    __defaultSettingsKeys.forEach(key => {
                        if (!this.settings[key]) {
                            log(key + ' was added after update')
                            this.settings[key] = DEFAULT_SETTINGS[key];
                        }
                    })
                } else if (!settingsKeys.every(key => __defaultSettingsKeys.includes(key))) {
                    settingsKeys.forEach(key => {
                        if (!DEFAULT_SETTINGS[key]) {
                            log(key + ' was deleted after update')
                            delete this.settings[key];
                        }
                    });
                };

                Alpine.store('settings', this.settings);
                Alpine.store('pastasData', this.pastasData);
                Alpine.store('SELF_MAIN', this);

                Alpine.bind('_savePasta_', async function () {
                    const binds = {};
                    return binds;
                }.bind(this));

                log('inited');
            },
            async savePasta(pasta, streamer) {
                try {
                    if (!pasta.msg.trim() || !streamer.trim()) {
                        this.showError('No pasta or streamer found.');
                        return false;
                    }
                    streamer = streamer.toLowerCase();
                    if (this.pastasData.streamers.includes(streamer) || await this.twitchUserExists(streamer)) {
                        if (!pasta.name.trim())
                            pasta.name = pasta.msg.trim().split` `[0].slice(0, 32);
                        with (this.pastasData) {
                            if (!streamers.includes(streamer)) {
                                streamers.push(streamer);
                            }
                            context[streamer]
                                ? context[streamer].push({
                                    name: pasta.name,
                                    msg: pasta.msg,
                                    uid: crypto.randomUUID(),
                                })
                                : context[streamer] = [{
                                    name: pasta.name,
                                    msg: pasta.msg,
                                    uid: crypto.randomUUID(),
                                }]
                        }
                    } else {
                        this.showError('User with this name does not exist. You should provide real logins to save.')
                        return false;
                    }
                } catch (e) {
                    log.error(e);
                    this.showError(e)
                }
                return true;
            },
            generateUID: generateUID,
            modalSettingsSave() {
                this.settingsModalShow = false;
                [...document.querySelectorAll('.settings-input-031f6120')]
                    .forEach(el => {
                        this.settings[el.name].val = el.value;
                    });

                window.__changeBtnEmote_(this);
                this.showSaved();
            },
            _closeMain__() {
                this._mainWindowShow__ = !this._mainWindowShow__;
            },
            showSaved() {
                this.saved = true;
                setTimeout(() => {
                    this.saved = false;
                }, 2e3);
            },
            showError(err) {
                this.error = true;
                this.errorMsg = err;
                setTimeout(() => {
                    this.error = false;
                    this.errorMsg = null;
                }, 5e3);
            },
            async saveToClipboard(msg) {
                await navigator.clipboard.writeText(msg);
                this.showSaved();
            },
            deletePasta(streamer, uid, streamerUID) {
                let ctx = this.pastasData.context[streamer];
                if (this.pastasData.context[streamer].length < 2)
                    this.deleteStreamer(streamer, streamerUID);
                else
                    this.pastasData.context[streamer].splice(ctx.map(e => e.uid).indexOf(uid), 1);

            },
            deleteStreamer(streamer, uid, pr = false) {
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
            async twitchUserExists(streamer) {
                let url = `https://tw-emotes-api.onrender.com/user?name=${streamer}`;

                return typeof await (await fetch(url)).json() === 'object';
            },
        }
    });

    Alpine.data('list', function () {
        return {
            streamers: this.$store.pastasData.streamers,
            context: this.$store.pastasData.context,
            active: null,
            select(item) {
                if (this.active == item)
                    return this.active = null;
                this.active = item;
            }
        }
    });

    Alpine.data('emotes', function () {
        return {
            async init() {
                window.__changeBtnEmote_ = this.changeBtnEmote;
                this.SELF_MAIN = this.$store.SELF_MAIN;

                await this.fetchData();

                if (!this.loading) {
                    window._ALL_EMOTES_REGEXP_ = this._ALL_EMOTES_REGEXP_
                    window._ALL_EMOTES_ = this._ALL_EMOTES_;
                    this.changeBtnEmote(this);
                }
            },
            async fetchData() {
                if (!this.loading) {
                    this.loading = true;

                    Object.assign(this, await new FetchAllData(this)._get());

                    log('Channel emotes loaded for ' + this.$store.pastasData.streamers.join(', '));
                    this.loading = false;
                    return;
                }
            },
            changeBtnEmote(self) {
                const $copyPastaBtn = document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca') || (LOCAL_DEBUG ? document.createElement('button') : void 0);
                let btnEmote = null;

                if (!$copyPastaBtn.parentNode && LOCAL_DEBUG) {
                    $copyPastaBtn.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';
                    $copyPastaBtn.className = 'cp-btn'
                    document.body.appendChild($copyPastaBtn);
                }

                $copyPastaBtn.onclick = function () {
                    self._mainWindowShow__ = !self._mainWindowShow__
                };

                try {
                    btnEmote = check7TV_BTTV(self.$store.settings.copyPastaBtnEmote.val);
                } catch (e) {
                    const emoteName = self.$store.settings.copyPastaBtnEmote.val;
                    btnEmote = emoteName.__parseEmote(window._ALL_EMOTES_REGEXP_, window._ALL_EMOTES_);

                    if (btnEmote == emoteName) {
                        const err = 'invalid URL or this emote is not available';
                        self.showError(err);
                        log.error(err);
                        self.$store.settings.copyPastaBtnEmote.val = btnEmote = ERROR_EMOTES[randNumb(ERROR_EMOTES.length)];
                        btnEmote = check7TV_BTTV(btnEmote);
                    }
                }

                $copyPastaBtn.innerHTML = btnEmote;

                return $copyPastaBtn;
            },
            createEmote: window.__createEmote,
            parseEmotes(msg, streamer) {
                try {
                    if (streamer == void 0) return;
                    if (msg.slice(-1) != ' ')
                        msg += ' ';
                    if (this.loading) {
                        setTimeout(() => this.parseEmotes(msg), 4e3);
                        return msg;
                    }
                    return msg.split` `.map(m =>
                        m.__parseEmote(this._regexp_GLOBAL, this.allGlobalEmotes)
                            .__parseEmote(this._regexp_CHANNELS[streamer], this.channelsEmotesObj[streamer])
                    )
                        .map(e => /\<\/?span\>/g.test(e) ? e + '###' : e).join` `.replace(/\#\#\# *[ ]/g, '');
                } catch (e) { log.error(e) };
            },
            async fillStreamersInfoAsync(arr) {
                await Promise.all(this.$store.pastasData.streamers
                    .map(async (streamer) =>
                        await getJSON('https://tw-emotes-api.onrender.com/full_user', { name: streamer })))
                    .then(data => {
                        data.forEach((e, i) => {
                            arr[i] = e;
                        });
                    })
                return;
            },
        }
    });
});

class FetchAllData {
    constructor(EMOTES_this) {
        let { $store, fillStreamersInfoAsync } = EMOTES_this;
        Object.assign(this, { $store, fillStreamersInfoAsync });
    }
    async _get() {
        this.channelsInfo = [];
        this.globalEmotes = await getJSON('https://tw-emotes-api.onrender.com/globalemotes');
        this.allGlobalEmotes = [].concat(...Object.values(this.globalEmotes));
        this._regexp_GLOBAL = new RegExp(
            this.allGlobalEmotes.map(e =>
                e.name.__create_STRING_RegExpForEmote()
            ).join`|`
            , 'gm');

        await this.fillStreamersInfoAsync(this.channelsInfo);

        this.channelsEmotesArr = this.channelsInfo
            .map(e => ({ [e.user.broadcaster_login]: e.emotes }));
        this.channelsEmotesObj = this.channelsEmotesArr.reduce((acc, v) => {
            const [k, reg] = Object.entries(v)[0]
            acc[k] = [].concat(...Object.values(reg));
            return acc;
        }, {});
        this.mergedChannelsEmotes = objectValuesMerge(this.channelsEmotesArr)
        this._regexp_CHANNELS = this.channelsEmotesArr
            .map(e => Object.entries(e)
                .map(([k, v]) => ({
                    [k]: new RegExp(
                        Object.values(v)
                            .map(e =>
                                e.map(e =>
                                    e.name.__create_STRING_RegExpForEmote()
                                ).join`|`
                            )
                        , 'gm'
                    )
                })
                )).reduce((acc, v) => {
                    const [k, reg] = Object.entries(v[0])[0]
                    acc[k] = reg;
                    return acc;
                }, {});
        this._ALL_EMOTES_ = [].concat(...Object.values(this.mergedChannelsEmotes).concat(...Object.values(this.globalEmotes)));
        this._ALL_EMOTES_REGEXP_ = new RegExp(
            this._ALL_EMOTES_.map(e =>
                e.name.__create_STRING_RegExpForEmote()
            ).join`|`
            , 'gm');

        return this;
    }
}

function log(msg) {
    console.info(`%c[CopyPasta] %c${msg}`, 'color: #9858FF', `color: #00B642`)
};

function generateUID() {
    return 'cp-' + crypto.randomUUID();
};

function __createEmote(alt, src) {
    const img = new Image();
    const spanA = document.createElement('span'),
        spanB = document.createElement('span');
    const uid = generateUID();
    // <span class="emote_container_2fdf6c3d b253c65b" :style="{minWidth: 28 + 'px'}"><span>
    spanA.setAttribute('class', 'emote_container_2fdf6c3d b253c65b');
    spanA.id = uid;
    img.src = src;
    img.id = uid;
    img.style = 'max-width: 100%; position:absolute;';
    img.alt = alt;
    spanA.appendChild(spanB);
    spanB.appendChild(img);
    img.onload = function () {
        try {
            document.querySelector('span#' + uid).setAttribute('style', 'min-width: ' + img.width + 'px');
        } catch (e) { log.error('something weird happened when parsing emote.' + e); }
    };
    return spanA.outerHTML;
};

function check7TV_BTTV(src) {
    src = new URL(src);
    let btnEmote = null;
    if ((src.origin.includes('7tv.app') || src.origin.includes('betterttv')) && /emote[s]?\/.*/.test(src.href)) {
        if (src.hostname.includes('cdn') && /\/emote\/.*\/[1-4]x\.webp/g.test(src.pathname)) {
            src = src.href.replace(/[234]x\.webp/, '1x.webp')
            btnEmote = __createEmote('', src)
        } else {
            src = `https://cdn.${src.host.replace(/com/, 'net')}${src.pathname.replace(/emotes/, 'emote')}/1x.webp`;
            btnEmote = __createEmote('', src);
        }
    } else throw new Error('Only 7tv and betterttv is supported');
    return btnEmote;
};

async function getJSON(url, params) {
    if (params !== void 0 && typeof params === 'object') {
        url += '?' + Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    }
    try {
        return (await fetch(url)).json()
    } catch (e) {
        log.error(e + ' On fetching url: ' + url);
        return {};
    }
}

function objectValuesMerge(arr) {
    let result = [];
    arr.forEach(e => {
        result.push(
            [].concat(...Object.values(Object.values(e)[0]).map(e => Object.values(e)))
        );
    });
    return [].concat(...result);
}

function randNumb(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

String.prototype.__parseEmote = function (RegExp_, emotesData) {
    try {
        if (!__createEmote) throw new Error('function __createEmote is not defined.');
        return this.replace(RegExp_, e => __createEmote(e, emotesData.find(a => a.name == e.replace(/ /g, '')).image1x));
    } catch (e) { log.error(e) }
}

String.prototype.__create_STRING_RegExpForEmote = function () {
    try {
        return this.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`)
            .replace(/^.*$/gmi, e => `^ *${e} *$`);
    } catch (e) { log.error(e) }
}
// ; (function () {

// var window = new Object();
var DEBUG = false;
var errorEmotes = [
    'https://7tv.app/emotes/638507a9fed40bb16636c6ac',
    'https://7tv.app/emotes/6151c1de43b2d9da0d32adf9',
    'https://7tv.app/emotes/61774bcae0801fb98787f5a5',
    'https://7tv.app/emotes/63c01677567c38e1a0ec8ab2',
    'https://7tv.app/emotes/625f1b0598a6c8cc55577855',
    'https://7tv.app/emotes/6299cf3347051898ec04cd6c',
];
var defaultSettings = {
    username: {
        type: 'text',
        val: 'c00ln1ckl33t',
        workingStatus: true,
    },
    savePastaMethod: {
        type: 'select',
        val: 'click',
        workingStatus: false,
    },
    theme: {
        type: 'select',
        val: 'dark',
        workingStatus: false,
    },
    copyPastaBtnEmote: {
        type: 'text',
        val: 'NaM',
        workingStatus: true,
    },
};
var defaultPastasData = {
    streamers: [],
    context: {},
};

log.error = console.error;


document.addEventListener('alpine:init', async function () {

    Alpine.data('_main_', function () {
        return {
            log: log,
            settings: this.$persist(this.$store.settings || defaultSettings),
            pastasData: this.$persist(this.$store.pastasData || defaultPastasData),
            settingsModalShow: false,
            _mainWindowShow__: DEBUG,
            saved: false,
            error: false,
            errorMsg: null,
            async savePasta(pasta, streamer) {
                try {
                    if (!pasta.msg.trim() || !streamer.trim()) {
                        this.showError('No pasta or streamer found.');
                        return false;
                    }
                    streamer = streamer.toLowerCase();
                    if (this.pastasData.streamers.includes(streamer) || await this.twitchUserExists(streamer)) {
                        if (!pasta.name.trim())
                            pasta.name = pasta.msg.trim().split` `[0];
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
            init() {
                Alpine.store('settings', this.settings);
                Alpine.store('pastasData', this.pastasData);
                Alpine.store('SELF_MAIN', this);

                Alpine.bind('_savePasta_', async function () {
                    const binds = {};
                    return binds;
                }.bind(this));

                log('inited');
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
            async fetchData() {
                if (!this.loading) {
                    this.loading = true;
                    this.globalEmotes = await this.getJSON('https://tw-emotes-api.onrender.com/globalemotes');

                    this.channelsInfo = [];

                    await this.fillStreamersInfoAsync(this.channelsInfo);


                    this.channelsEmotesArr = this.channelsInfo
                        .map(e => ({ [e.user.broadcaster_login]: e.emotes }));

                    this.channelsEmotesObj = this.channelsEmotesArr.reduce((acc, v) => {
                        const [k, reg] = Object.entries(v)[0]
                        acc[k] = [].concat(...Object.values(reg));
                        return acc;
                    }, {});

                    this.mergedChannelsEmotes = this.deepObjectValuesMerge(this.channelsEmotesArr)

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


                    this.allGlobalEmotes = [].concat(...Object.values(this.globalEmotes));
                    this._ALL_EMOTES_ = [].concat(...Object.values(this.mergedChannelsEmotes).concat(...Object.values(this.globalEmotes)));

                    this._regexp_GLOBAL = new RegExp(
                        this.allGlobalEmotes.map(e =>
                            e.name.__create_STRING_RegExpForEmote()
                        ).join`|`
                        , 'gm');

                    this._ALL_EMOTES_REGEXP_ = new RegExp(
                        this._ALL_EMOTES_.map(e =>
                            e.name.__create_STRING_RegExpForEmote()
                        ).join`|`
                        , 'gm');


                    log('emotes loaded');
                    this.loading = false;
                    return;
                }
            },
            async init() {
                window.__changeBtnEmote_ = this.changeBtnEmote;
                Alpine.store('SELF_EMOTES', this);
                await this.fetchData();

                if (!this.loading) {
                    window._ALL_EMOTES_REGEXP_ = this._ALL_EMOTES_REGEXP_
                    window._ALL_EMOTES_ = this._ALL_EMOTES_;
                    this.changeBtnEmote(this);
                }
            },
            changeBtnEmote(self) {
                const $copyPastaBtn = document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca') || (DEBUG ? document.createElement('button') : void 0);
                const SELF_MAIN = self.$store.SELF_MAIN;
                let btnEmote = null;

                if (!$copyPastaBtn.parentNode && DEBUG) {
                    $copyPastaBtn.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';
                    document.body.appendChild($copyPastaBtn);
                }

                $copyPastaBtn.onclick = function () {
                    SELF_MAIN._mainWindowShow__ = !SELF_MAIN._mainWindowShow__
                };

                const check7TV_BTTV = function (src) {
                    src = new URL(src);
                    let btnEmote = null;
                    if ((src.origin.includes('7tv.app') || src.origin.includes('betterttv')) && src.href.includes('emote')) {
                        if (src.hostname.includes('cdn') && /\/emote\/.*\/[1-4]x\.webp/g.test(src.pathname)) {
                            src = src.href.replace(/[234]x\.webp/, '1x.webp')
                            btnEmote = __createEmote('', src)
                        } else {
                            src = `https://cdn.${src.host.replace(/com/, 'net')}${src.pathname.replace(/emotes/, 'emote')}/1x.webp`;
                            btnEmote = __createEmote('', src);
                        }
                    } else throw new Error('Only 7tv.app and betterttv is supported');
                    return btnEmote;
                };

                try {
                    btnEmote = check7TV_BTTV(self.$store.settings.copyPastaBtnEmote.val);

                } catch (e) {
                    const emoteName = self.$store.settings.copyPastaBtnEmote.val;
                    btnEmote = emoteName.__parseEmote(window._ALL_EMOTES_REGEXP_, window._ALL_EMOTES_);

                    if (btnEmote == emoteName) {
                        const err = 'invalid URL or this emote is not available';
                        SELF_MAIN.showError(err)
                        console.error(err);
                        self.$store.settings.copyPastaBtnEmote.val = btnEmote = errorEmotes[randNumb(errorEmotes.length)];
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
            deepObjectValuesMerge(arr) {
                let result = [];
                arr.forEach(e => {
                    result.push(
                        [].concat(...Object.values(Object.values(e)[0]).map(e => Object.values(e)))
                    );
                });
                return [].concat(...result);
            },
            async getJSON(url, params) {
                if (params !== void 0 && typeof params === 'object') {
                    url += '?' + Object.entries(params).map(([key, value]) => `${key}=${value} `).join('&');
                }
                try {
                    return (await fetch(url)).json()
                } catch (e) {
                    log.error(e + ' On fetching url: ' + url);
                    return {};
                }
            },
            async fillStreamersInfoAsync(arr) {
                await Promise.all(this.$store.pastasData.streamers
                    .map(async (streamer) =>
                        await this.getJSON('https://tw-emotes-api.onrender.com/full_user', { name: streamer })))
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
        document.querySelector('span#' + uid).setAttribute('style', 'min-width: ' + img.width + 'px')
    };
    return spanA.outerHTML;
};

function randNumb(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

String.prototype.__parseEmote = function (REGEXP, EMOTES_DATA) {
    if (!__createEmote) throw new Error('function __createEmote not defined.');
    return this.replace(REGEXP, e => __createEmote(e, EMOTES_DATA.find(a => a.name == e.replace(/ /g, '')).image1x));
}

String.prototype.__create_STRING_RegExpForEmote = function () {
    return this.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`)
        .replace(/^.*$/gmi, e => `^ *${e} *$`)
}

// })()
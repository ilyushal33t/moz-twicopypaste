var DEBUG = true;

document.addEventListener('alpine:init', async function () {

    function log(msg) {
        console.info(`%c[CopyPasta] %c${msg}`, 'color: #9858FF', `color: #00B642`)
    }
    log.error = console.error;

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
        }
    };
    var defaultPastasData = {
        streamers: [],
        context: {},
    };

    Alpine.data('_main_', function () {
        return {
            log: log,
            settings: this.$persist(this.$store.settings || defaultSettings),
            pastasData: this.$persist(this.$store.pastasData || defaultPastasData),
            async savePasta(pasta, streamer) {
                try {
                    streamer = streamer.toLowerCase();
                    if (this.pastasData.streamers.includes(streamer) || await this.twitchUserExists(streamer)) {
                        if (!pasta.name.trim())
                            pasta.name = pasta.msg.trim().split` `[0];
                        if (!streamer.trim())
                            streamer = 'global';
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
                    } else { return false; }
                } catch (e) { log.error(e); }
                return true;
            },
            settingsModalShow: false,
            modalSettingsSave() {
                this.settingsModalShow = false;
                [...document.querySelectorAll('.settings-input-031f6120')]
                    .forEach(el => {
                        this.settings[el.name].val = el.value;
                    })
                this.showSaved();
            },
            _mainWindowShow__: DEBUG,
            _closeMain__() {
                this._mainWindowShow__ = !this._mainWindowShow__;
            },
            saved: false,
            showSaved() {
                this.saved = true;
                setTimeout(() => {
                    this.saved = false;
                }, 2e3);
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
                    // console.log(ctx.map(e => e.uid).indexOf(uid))
                    this.pastasData.context[streamer].splice(ctx.map(e => e.uid).indexOf(uid), 1);

            },
            deleteStreamer(streamer, uid, pr = false) {
                if (!pr) {
                    let startTime = new Date().getTime();
                    pr = confirm('Are you sure you want to delete this streamer and pastas for him?');
                    let endTime = new Date().getTime();
                    if (endTime - startTime < 50) pr = true;
                }
                console.log(window.confirm.toString())
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
                log('inited');
                Alpine.store('settings', this.settings);
                Alpine.store('pastasData', this.pastasData);

                Alpine.bind('_savePasta_', async function () {
                    const binds = {};
                    return binds;
                }.bind(this));
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
                                                e.name.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`)
                                                    .replace(/^.*$/gmi, e => `^ *${e} *$`)
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


                    this.allGlobalEmotes = [].concat(...Object.values(this.globalEmotes))//[].concat(...Object.values(this.mergedChannelsEmotes).concat(Object.values(this.globalEmotes)))
                    this._regexp_GLOBAL = this.allGlobalEmotes.map(e =>
                        e.name.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`).replace(/^.*$/gmi, e => `^ *${e} *$`)
                    ).join`|`;
                    this._regexp_GLOBAL = new RegExp(this._regexp_GLOBAL, 'gm');
                    log('emotes loaded');
                    this.loading = null;
                    return;
                }
            },
            async init() {
                window.__createEmote = this.createEmote;
                await this.fetchData();
            },
            createEmote(alt, src) {
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
            },
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
                        m.replace(this._regexp_GLOBAL, e => this.createEmote(e, this.allGlobalEmotes.find(a => a.name == e.replace(/ /g, '')).image1x))
                            .replace(this._regexp_CHANNELS[streamer], e => this.createEmote(e, this.channelsEmotesObj[streamer].find(a => a.name == e.replace(/ /g, '')).image1x))
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
})

function generateUID() {
    return 'cp-' + crypto.randomUUID();
}
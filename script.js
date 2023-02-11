document.addEventListener('alpine:init', async function () {

    //TODO: 
    // test if twitch user exists 
    // bug with deleting

    function log(msg) {
        console.info(`%c[CopyPaste] %c${msg}`, 'color: #9858FF', `color: #00B642`)
    }
    log.error = console.error;

    var defaultSettings = {
        username: {
            type: 'text',
            val: 'c00ln1ckl33t',
            workingStatus: true,
        },
        savePasteMethod: {
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
    var defaultPastesData = {
        streamers: [],
        context: {},
    };

    Alpine.data('_main_', function () {
        return {
            settings: this.$persist(this.$store.settings || defaultSettings),
            pastesData: this.$persist(this.$store.pastesData || defaultPastesData),
            savePaste(paste, streamer) {
                try {
                    if (!paste.name.trim())
                        paste.name = paste.msg.trim().split` `[0];
                    if (!streamer.trim())
                        streamer = 'global';
                    with (this.pastesData) {
                        if (!streamers.includes(streamer)) {
                            streamers.push(streamer);
                        }
                        context[streamer]
                            ? context[streamer].push({
                                name: paste.name,
                                msg: paste.msg,
                                uid: crypto.randomUUID(),
                            })
                            : context[streamer] = [{
                                name: paste.name,
                                msg: paste.msg,
                                uid: crypto.randomUUID(),
                            }]
                    }
                } catch (e) { log.error(e); }
            },
            settingsModalShow: false,
            modalSettingsSave() {
                [...document.querySelectorAll('.settings-input-031f6120')]
                    .forEach(el => {
                        this.settings[el.name].val = el.value;
                    })
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
            deletePaste(streamer, uid, streamerUID) {
                let ctx = this.pastesData.context[streamer];
                if (this.pastesData.context[streamer].length < 2)
                    this.deleteStreamer(streamer, streamerUID);
                else
                    this.pastesData.context[streamer] = ctx.filter((_, i) => i != ctx.map(e => e.uid).indexOf(uid));

            },
            deleteStreamer(streamer, uid, pr = false) {
                if (!pr) pr = confirm('Are you sure you want to delete this streamer and pastes for him?');
                if (pr) {
                    this.pastesData.streamers = this.pastesData.streamers.filter((_, i) => i != this.pastesData.streamers.indexOf(streamer))
                    delete this.pastesData.context[streamer];
                    document.querySelector('#' + uid).remove();
                }
            },
            generateUID() {
                return 'cp-' + crypto.randomUUID();
            },
            init() {
                log('inited');
                Alpine.store('settings', this.settings);
                Alpine.store('pastesData', this.pastesData);

                Alpine.bind('_savePaste_', async function () {
                    const binds = {};
                    return binds;
                }.bind(this));
            },
        }
    });

    Alpine.data('list', function () {
        return {
            streamers: this.$store.pastesData.streamers,
            context: this.$store.pastesData.context,
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


                    this.channelsEmotes = this.channelsInfo.map(e => ({ [e.user.broadcaster_login]: e.emotes }));
                    this.mergedChannelsEmotes = this.deepObjectValuesMerge(this.channelsEmotes)

                    console.log(this.mergedChannelsEmotes);

                    this.allEmotes = [].concat(...Object.values(this.mergedChannelsEmotes).concat(Object.values(this.globalEmotes)))
                    this._regexp = this.allEmotes.map(e =>
                        e.name.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`).replace(/^.*$/gmi, e => `^ *${e} *$`)
                    ).join`|`;
                    this._regexp = new RegExp(this._regexp, 'gm');
                    log('loaded emotes');
                    this.loading = null;
                    return;
                }
            },
            async init() {
                await this.fetchData();
            },
            createEmote(alt, src) {
                return `<span class="emote_container_2fdf6c3d b253c65b" :style="{minWidth: ($refs.img.width || 28) + 'px'}"><span>
                <img x-ref="img" style="max-width: 100%; position:absolute;" alt='${alt}' src='${src}'/></span></span>`;
            },
            parseEmotes(msg) {
                try {
                    if (msg.slice(-1) != ' ')
                        msg += ' ';
                    if (this.loading) {
                        setTimeout(() => this.parseEmotes(msg), 4e3);
                        return msg;
                    }
                    return msg.split` `.map(m => m.replace(this._regexp, e => this.createEmote(e, this.allEmotes.find(a => a.name == e.replace(/ /g, '')).image1x)))
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
                    url += '?' + Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
                }
                try {
                    return (await fetch(url)).json()
                } catch (e) {
                    log.error(e + ' On fetching url: ' + url);
                    return {};
                }
            },
            async fillStreamersInfoAsync(arr) {
                await Promise.all(this.$store.pastesData.streamers
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
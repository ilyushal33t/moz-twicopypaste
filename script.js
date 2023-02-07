document.addEventListener('alpine:init', async function () {

    Alpine.data('_main_', function () {
        return {
            settings: this.$persist(this.$store.settings || { username: 'c00ln1ckl33t' }),
            pastesData: this.$persist(this.$store.pastesData || { streamers: [], context: {} }),
            savePaste(paste, streamer) {
                if (!paste.name.trim())
                    paste.name = paste.msg.trim().split` `[0];
                with (this.pastesData) {

                    if (!streamers.includes(streamer)) {
                        streamers.push(streamer);
                    }
                    context[streamer]
                        ? context[streamer].push({
                            name: paste.name,
                            msg: paste.msg,
                        })
                        : context[streamer] = [{
                            name: paste.name,
                            msg: paste.msg,
                        }]
                }
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
            init() {
                Alpine.store('settings', this.settings);
                Alpine.store('pastesData', this.pastesData);
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
            async getJSON(url) {
                return (await fetch(url)).json()
            },
            async fetchData() {
                if (!this.loading) {
                    this.loading = true;
                    this.globalEmotes = await this.getJSON('https://tw-emotes-api.onrender.com/globalemotes');

                    this.channelInfo = await this.getJSON(`https://tw-emotes-api.onrender.com/full_user?name=forsen`);

                    this.channelEmotes = this.channelInfo.emotes;
                    this.allEmotes = [].concat(...Object.values(this.channelEmotes).concat(Object.values(this.globalEmotes)))
                    this._regexp = this.allEmotes.map(e =>
                        e.name.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`).replace(/^.*$/gmi, e => `^ *${e} *$`)
                    ).join`|`;
                    this._regexp = new RegExp(this._regexp, 'gm');
                    console.log(this._regexp);
                    this.loading = null;
                    return;
                }
            },
            async init() {
                await this.fetchData();
            },
            createEmote(alt, src) {
                return `<span class="emote_container_2fdf6c3d b253c65b" :style="{minWidth: $refs.img.width + 'px'}"><span>
                            <img x-ref="img" style="max-width: 100%; position:absolute;" alt='${alt}' src='${src}' />
                        </span></span>`;
            },
            parseEmotes(msg) {
                if (this.loading) {
                    setTimeout(() => this.parseEmotes(msg), 4e3);
                    return msg;
                }
                return msg.split` `.map(m => m.replace(this._regexp, e => this.createEmote(e, this.allEmotes.find(a => a.name == e.replace(/ /g, '')).image1x)))
                    .map(e => /\<\/?span\>/g.test(e) ? e + '###' : e).join` `.replace(/\#\#\# *[ ]/g, '');
            }
        }
    });
})
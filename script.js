document.addEventListener('alpine:init', () => {
    Alpine.data('dropdown', () => ({
        open: false,
        toggle() {
            this.open = !this.open;
        },
    }));

    Alpine.store('settings', {
        username: 'ilial33t',
        posts: ['post1', 'post2']
    })

    Alpine.data('list', () => (
        {
            streamers: ['ilial33t', 'forsen'],
            context: {
                ilial33t: [
                    {
                        name: 'test name',
                        msg: 'test p',
                    },
                    {
                        name: 'test name2',
                        msg: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssssssssssssssssssssssssss',
                    },
                ],
                forsen: [
                    {
                        name: 'test name forsen',
                        msg: 'test p forsen sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss  forsenBitrate  forsenBitrate  forsenBitrate  forsenBitrate  forsenBitrate asdadasdsad',
                    },
                    {
                        name: 'dasd',
                        msg: "test p forsen sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss PagMan PagMan PagMan PagMan PagMan asdadasdsad"
                    }
                ]
            },
            active: null,
            select(item) {
                if (this.active == item)
                    return this.active = null;
                this.active = item;
            }
        }
    ));

    Alpine.data('emotes', () => (
        {
            async fetchData() {
                if (!this.loading) {
                    this.loading = true;
                    this.global = await (await fetch('https://tw-emotes-api.onrender.com/globalemotes')).json();
                    this.channelInfo = await (await fetch(`https://tw-emotes-api.onrender.com/full_user?name=forsen`)).json();
                    this.channelEmotes = this.channelInfo.emotes;
                    this.allEmotes = [].concat(...Object.values(this.channelEmotes).concat(Object.values(this.global)))
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
                    setTimeout(() => this.parseEmotes(msg), 2e3);
                    return msg;
                }
                return msg.split` `.map(m => m.replace(this._regexp, e => this.createEmote(e, this.allEmotes.find(a => a.name == e.replace(/ /g, '')).image1x)))
                    .map(e => /\<\/?span\>/g.test(e) ? e + '###' : e).join` `.replace(/\#\#\# *[ ]/g, '');
            }
        }
    ));
})
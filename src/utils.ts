class FetchAllEmotesData {
    public _globalEmotes: EmotesData[];
    public allGlobalEmotes: EmotesData[];
    public _regexpGlobalEmotes: RegExp;
    public channelsInfo: StreamerData[];
    public channelsEmotesArr: any; //
    public channelsEmotesObj: EmotesData[];
    public mergedChannelsEmotes: any; //
    public _regexpChannelEmotes: RegExp;
    public _ALL_EMOTES_: EmotesData[];
    public _ALL_EMOTES_REGEXP_: RegExp;
    constructor(
        private $store: any
    ) { }

    async _get(): Promise<FetchAllEmotesData> {
        await this.globalEmotes();
        await this.channelsEmotes();
        this.allEmotes();
        return this;
    }
    async fillStreamersInfoAsync<StreamerData>(arr: [] | StreamerData[]): Promise<StreamerData[]> {
        await Promise.all(this.$store.pastasData.streamers
            .map(async (streamer: string) => {
                let channel: TwitchUserInfo = await getJSON(API_URL.channel, { name: streamer })
                log.debug(channel)
                if (channel.error) return {
                    user: {
                        error: 'This user does not exist or got banned.',
                    },
                    emotes: {
                        error: 'This user does not exist or got banned.',
                    },
                };
                let channelEmotes = await getJSON(API_URL.channelEmotes, { id: channel.id })
                console.log(channelEmotes)
                return {
                    user: channel,
                    emotes: channelEmotes,
                }
            }))
            .then(data => {
                data.forEach((e, i) => {
                    if (e.user.error) return;
                    log.debug(e.user.error)
                    arr[i] = e;
                });
            })
        return arr;
    }
    async globalEmotes(): Promise<void> {
        this._globalEmotes = await getJSON(API_URL.globalEmotes);
        this.allGlobalEmotes = [].concat(...Object.values(this._globalEmotes));
        this._regexpGlobalEmotes = new RegExp(
            this.allGlobalEmotes.map(e =>
                e.name.__createEmoteRegExp()
            ).join(`|`)
            , 'gm');
    }
    async loadTempEmotes(streamer: string) {
        let channel: TwitchUserInfo = await getJSON(API_URL.channel, { name: streamer });
        let channelEmotes = await getJSON(API_URL.channelEmotes, { id: channel.id });
        return channelEmotes;
    }
    async channelsEmotes(): Promise<void> {
        this.channelsInfo = [];
        await this.fillStreamersInfoAsync(this.channelsInfo);
        this.channelsEmotesArr = this.channelsInfo
            .map(e => ({ [e.user?.broadcaster_login ?? e.error]: e.emotes }));
        this.channelsEmotesObj = this.channelsEmotesArr.reduce((acc, v) => {
            const [k, reg] = Object.entries(v)[0]
            acc[k] = [].concat(...Object.values(reg));
            return acc;
        }, {});
        this.mergedChannelsEmotes = objectValuesMerge(this.channelsEmotesArr)
        this._regexpChannelEmotes = this.channelsEmotesArr
            .map(e => {
                console.log(e)
                if (e.error) return;
                return Object.entries(e)
                    .map(([k, v]) => ({
                        [k]: new RegExp(
                            Object.values(v)
                                .map(e =>
                                    e.map(e =>
                                        e.name.__createEmoteRegExp()
                                    ).join`|`
                                ).join('')
                            , 'gm'
                        )
                    })
                    )
            }).reduce((acc, v) => {
                const [k, reg] = Object.entries(v[0])[0]
                acc[k] = reg;
                return acc;
            }, {});
    }
    allEmotes(): void {
        this._ALL_EMOTES_ = [].concat(...Object.values(this.mergedChannelsEmotes).concat(...Object.values(this._globalEmotes)));
        this._ALL_EMOTES_REGEXP_ = new RegExp(
            this._ALL_EMOTES_.map(e =>
                e.name.__createEmoteRegExp()
            ).join(`|`)
            , 'gm');
        return;
    }
}

function log(msg: string): void {
    console.info(`%c[CopyPasta] %c${msg}`, 'color: #9858FF', `color: #00B642`)
};

log.error = console.error;
log.debug = console.debug;

function ifDebug(f: Function, ...args): void {
    if (!DEBUG) return;

    f(...args);
};

function generateUID(): string {
    return 'cp-' + crypto.randomUUID();
};

function __createEmote(alt: string, src: string, minWidth?: number): string {
    const img = new Image();
    const spanA = document.createElement('span'),
        spanB = document.createElement('span');
    const uid = generateUID();
    spanA.setAttribute('class', 'emote_container_2fdf6c3d b253c65b');
    spanA.id = uid;
    img.src = src;
    img.id = uid;
    img.style.maxWidth = '100%';
    img.style.position = 'absolute';
    img.alt = alt;
    spanA.appendChild(spanB);
    spanB.appendChild(img);
    img.onload = function () {
        try {
            document.querySelector('span#' + uid)?.setAttribute('style', 'min-width: ' + img.width + 'px');
        } catch (e) { log.error('something weird happened when parsing emote.' + e); }
    };
    return spanA.outerHTML;
};

/**
 * 
 * @function check7TV_BTTV
 * @returns string of html span elements with 7tv or bttv img emote
 * @throws Error if url is not valid to 7tv or bttv source
 */

function check7TV_BTTV(source: string): string | Error {
    let src: URL | string = new URL(source);
    let btnEmote: null | string = null;
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

async function getJSON(url: string, params: undefined | {} = void 0): Promise<any> {
    if (params !== void 0 && typeof params === 'object' && params.constructor.name === 'Object') {
        url += '?' + Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    }
    try {
        return (await fetch(url)).json()
    } catch (e) {
        log.error(e + ' On fetching url: ' + url);
        return {};
    }
}

function checkForHTML(text: string): boolean {
    let elem = document.createElement('div')
    elem.innerHTML = text;
    return !!elem.childElementCount;
}

function objectValuesMerge(arr: Array<{}>): Array<{}> {
    //TODO: rewrite for universal use
    let result: {}[] = [];
    arr.forEach(e => {
        result.push(
            [].concat(...Object.values(Object.values(e)[0]).map(e => Object.values(e)))
        );
    });
    return [].concat(...result);
}

function randNumb(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min) + min);
}

String.prototype.__parseEmote = function (regex: RegExp, emotesData: Array<EmotesData>): string {
    try {
        if (typeof emotesData === 'object' && emotesData.constructor.name === 'Array' && emotesData.length > 0) {
            return this.replace(regex, e => __createEmote(e, emotesData.find(a => a.name == e.replace(/ /g, '')).image1x));
        }
    } catch (e) { log.error(e); }
    return this;
}

String.prototype.__createEmoteRegExp = function (): string {
    try {
        return this.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, e => `\\${e}`)
            .replace(/^.*$/gmi, e => `^ *${e} *$`);
    } catch (e) { log.error(e) }
}

String.prototype.__parseEmotes = function (
    regexGlobal: RegExp,
    emotesGlobal: EmotesData[],
    regexChannel?: RegExp,
    emotesChannel?: EmotesData[]
): string {
    if (regexChannel && emotesChannel)
        return this.split(` `).map(m => {
            if (regexGlobal.test(m))
                return m.__parseEmote(regexGlobal, emotesGlobal)
            else if (regexChannel.test(m))
                return m.__parseEmote(regexChannel, emotesChannel)
            return m;
        }
        ).map(e => /\<\/?span\>/g.test(e) ? e + '###' : e).join(` `).replace(/\#\#\# *[ ]/g, '');
    else
        return this.split(` `).map(m => m.__parseEmote(regexGlobal, emotesGlobal)
        ).map(e => /\<\/?span\>/g.test(e) ? e + '###' : e).join(` `).replace(/\#\#\# *[ ]/g, '');
}
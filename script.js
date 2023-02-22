var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//TODO: more settings, user interactive functions, fav emotes[?] live-preview fix, search by pastas names
var DEBUG = false;
var LOCAL_DEBUG = document.location.host != 'www.twitch.tv';
var API_URL = new /** @class */ (function () {
    function class_1() {
        this.URL = 'https://tw-emotes-api.onrender.com';
        this.globalEmotes = this.URL + '/globalemotes';
        this.channel = this.URL + '/user';
        this.channelEmotes = this.URL + '/useremotes';
        this.fullUser = this.URL + '/full_user';
    }
    return class_1;
}());
var DEFAULT_SETTINGS = {
    username: {
        name: 'Your username',
        help: 'Change username you want to see examples from.',
        type: 'text',
        val: 'c00ln1ckl33t',
        workingStatus: true
    },
    savePastaMethod: {
        name: 'Clipboard save method',
        help: 'Method you want to save pasta to clipboard.',
        type: 'select',
        val: 'click',
        workingStatus: false
    },
    theme: {
        name: 'Theme',
        help: 'Change extension theme',
        type: 'select',
        val: 'dark',
        workingStatus: false
    },
    copyPastaBtnEmote: {
        name: 'Open button emote',
        help: 'Write an emote name if this emote is available from someone\'s streamer you added, or paste 7tv or betterttv URL to emote (cdn / emote page).',
        type: 'text',
        val: 'NaM',
        workingStatus: true
    }
};
var DEFAULT_PASTAS_DATA = {
    streamers: [],
    context: {}
};
var ERROR_EMOTES = [
    'https://7tv.app/emotes/638507a9fed40bb16636c6ac',
    'https://7tv.app/emotes/6151c1de43b2d9da0d32adf9',
    'https://7tv.app/emotes/61774bcae0801fb98787f5a5',
    'https://7tv.app/emotes/63c01677567c38e1a0ec8ab2',
    'https://7tv.app/emotes/625f1b0598a6c8cc55577855',
    'https://7tv.app/emotes/6299cf3347051898ec04cd6c',
];
log.error = console.error;
document.addEventListener('alpine:init', function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Alpine.data('_main_', function () {
                return {
                    log: log,
                    settings: this.$persist(this.$store.settings || DEFAULT_SETTINGS),
                    pastasData: this.$persist(this.$store.pastasData || DEFAULT_PASTAS_DATA),
                    settingsModalShow: false,
                    mainWindowShow: DEBUG,
                    saved: false,
                    error: false,
                    errorMsg: null,
                    streamerModel: LOCAL_DEBUG ? 'forsen' : document.location.pathname.slice(1),
                    streamerExists: true,
                    textareaModel: '',
                    searchByPastanameModel: '',
                    searchRegExp: function () {
                        return new RegExp(this.searchByPastanameModel, 'gmi');
                    },
                    isLoadingEmotes: function () {
                        return this.streamerExists ? 'Loading emotes for ' + this.streamerModel + '...' : 'No streamer found yet.';
                    },
                    init: function () {
                        var _this = this;
                        var settingsKeys = Object.keys(this.settings);
                        var __defaultSettingsKeys = Object.keys(DEFAULT_SETTINGS);
                        if (!__defaultSettingsKeys.every(function (key) { return settingsKeys.includes(key); })) {
                            __defaultSettingsKeys.forEach(function (key) {
                                if (!_this.settings[key]) {
                                    log(key + ' was added after update');
                                    _this.settings[key] = DEFAULT_SETTINGS[key];
                                }
                            });
                        }
                        else if (!settingsKeys.every(function (key) { return __defaultSettingsKeys.includes(key); })) {
                            settingsKeys.forEach(function (key) {
                                if (!DEFAULT_SETTINGS[key]) {
                                    log(key + ' was deleted after update');
                                    delete _this.settings[key];
                                }
                            });
                        }
                        ;
                        Alpine.store('settings', this.settings);
                        Alpine.store('pastasData', this.pastasData);
                        globalThis.__MAIN__ = this;
                        log('inited');
                    },
                    savePasta: function (pasta, streamer) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, e_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 3, , 4]);
                                        if (!pasta.msg.trim() || !streamer.trim()) {
                                            this.showError('No pasta or streamer found.');
                                            return [2 /*return*/, false];
                                        }
                                        streamer = streamer.toLowerCase();
                                        _a = this.pastasData.streamers.includes(streamer);
                                        if (_a) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.twitchUserExists(streamer)];
                                    case 1:
                                        _a = (_b.sent());
                                        _b.label = 2;
                                    case 2:
                                        if (_a) {
                                            if (!pasta.name.trim())
                                                pasta.name = pasta.msg.trim().split(" ")[0].slice(0, 32);
                                            if (!this.pastasData.streamers.includes(streamer)) {
                                                this.pastasData.streamers.push(streamer);
                                            }
                                            this.pastasData.context[streamer]
                                                ? this.pastasData.context[streamer].push({
                                                    name: pasta.name,
                                                    msg: pasta.msg,
                                                    parsedCache: globalThis.__EMOTES__.parseEmotes(pasta.msg, streamer),
                                                    uid: generateUID()
                                                })
                                                : this.pastasData.context[streamer] = [{
                                                        name: pasta.name,
                                                        msg: pasta.msg,
                                                        parsedCache: globalThis.__EMOTES__.parseEmotes(pasta.msg, streamer),
                                                        uid: generateUID()
                                                    }];
                                            this.showSaved();
                                        }
                                        else {
                                            this.showError('User with this name does not exist. You should provide real logins to save.');
                                            return [2 /*return*/, false];
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _b.sent();
                                        log.error(e_1);
                                        this.showError(e_1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/, true];
                                }
                            });
                        });
                    },
                    modalSettingsSave: function () {
                        var _this = this;
                        this.settingsModalShow = false;
                        var settings = document.querySelectorAll('input.settings-input-031f6120');
                        Array.from(settings)
                            .forEach(function (el) {
                            _this.settings[el.name].val = el.value;
                        });
                        globalThis.__EMOTES__.changeBtnEmote(this);
                        this.showSaved();
                    },
                    showSaved: function () {
                        var _this = this;
                        this.saved = true;
                        setTimeout(function () {
                            _this.saved = false;
                        }, 2e3);
                    },
                    showError: function (err) {
                        var _this = this;
                        this.error = true;
                        this.errorMsg = err;
                        setTimeout(function () {
                            _this.error = false;
                            _this.errorMsg = null;
                        }, 5e3);
                    },
                    openMainWindow: function () {
                        this.mainWindowShow = !this.mainWindowShow;
                    },
                    deletePasta: function (streamer, uid, streamerUID) {
                        var ctx = this.pastasData.context[streamer];
                        if (this.pastasData.context[streamer].length < 2)
                            this.deleteStreamer(streamer, streamerUID);
                        else
                            this.pastasData.context[streamer].splice(ctx.map(function (e) { return e.uid; }).indexOf(uid), 1);
                    },
                    deleteStreamer: function (streamer, uid, pr) {
                        if (pr === void 0) { pr = false; }
                        if (!pr) {
                            var startTime = new Date().getTime();
                            pr = confirm('Are you sure you want to delete this streamer and pastas for him?');
                            var endTime = new Date().getTime();
                            if (endTime - startTime < 50)
                                pr = true;
                        }
                        if (pr) {
                            this.pastasData.streamers.splice(this.pastasData.streamers.indexOf(streamer), 1);
                            delete this.pastasData.context[streamer];
                        }
                        return pr;
                    },
                    saveToClipboard: function (msg) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, navigator.clipboard.writeText(msg)];
                                    case 1:
                                        _a.sent();
                                        this.showSaved();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    twitchUserExists: function (streamer) {
                        return __awaiter(this, void 0, void 0, function () {
                            var url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = "https://tw-emotes-api.onrender.com/user?name=".concat(streamer);
                                        return [4 /*yield*/, fetch(url)];
                                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                                    case 2: return [2 /*return*/, typeof (_a.sent()) === 'object'];
                                }
                            });
                        });
                    },
                    _binds_: {
                        textarea: {
                            spellcheck: false,
                            maxlength: 500,
                            'x-ref': "textarea",
                            'x-model.debounce': "textareaModel",
                            "class": "cp-area-bee11b14",
                            name: "cp-area-bee11b14",
                            id: "cp-area-bee11b14",
                            'x-init': "$el.addEventListener('keyup',e=>{let{shiftKey:s,ctrlKey:c,altKey:a,keyCode:k}=e;if([s,c,a].every(e=>e==0)&&k==13)($refs.saveBtn.click(),$el.value='')})",
                            placeholder: "type here..."
                        },
                        searchByPastaname: {
                            spellcheck: false,
                            'x-model.debounce': "searchByPastanameModel"
                        }
                    }
                };
            });
            Alpine.data('list', function () {
                return {
                    streamers: this.$store.pastasData.streamers,
                    context: this.$store.pastasData.context,
                    active: null,
                    select: function (item) {
                        if (this.active == item)
                            return this.active = null;
                        this.active = item;
                    }
                };
            });
            Alpine.data('emotes', function () {
                return {
                    init: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        globalThis.__EMOTES__ = this;
                                        return [4 /*yield*/, this.fetchData()];
                                    case 1:
                                        _a.sent();
                                        if (!this.loading) {
                                            globalThis._ALL_EMOTES_REGEXP_ = this._ALL_EMOTES_REGEXP_;
                                            globalThis._ALL_EMOTES_ = this._ALL_EMOTES_;
                                            this.changeBtnEmote(this);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    },
                    fetchData: function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!!this.loading) return [3 /*break*/, 2];
                                        this.loading = true;
                                        _b = (_a = Object).assign;
                                        _c = [this];
                                        return [4 /*yield*/, new FetchAllData(this.$store)._get()];
                                    case 1:
                                        _b.apply(_a, _c.concat([_d.sent()]));
                                        log('Channel emotes loaded for ' + this.$store.pastasData.streamers.join(', '));
                                        this.loading = false;
                                        return [2 /*return*/];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        });
                    },
                    changeBtnEmote: function (self) {
                        var $copyPastaBtn = document.querySelector('button#cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca') || document.createElement('button');
                        var btnEmote;
                        if (!$copyPastaBtn.parentNode && LOCAL_DEBUG) {
                            $copyPastaBtn.id = 'cp-155de7a2-c3d2-4d24-84b4-64cf22efb3ca';
                            $copyPastaBtn.className = 'cp-btn';
                            document.body.appendChild($copyPastaBtn);
                        }
                        var $newCopyPastaBtn = $copyPastaBtn.cloneNode(true);
                        console.log($newCopyPastaBtn instanceof Element);
                        var open = function () { return globalThis.__MAIN__.openMainWindow(); };
                        $newCopyPastaBtn.addEventListener('click', open);
                        $copyPastaBtn.parentNode.insertBefore($newCopyPastaBtn, $copyPastaBtn);
                        $copyPastaBtn.remove();
                        try {
                            btnEmote = check7TV_BTTV(self.$store.settings.copyPastaBtnEmote.val);
                        }
                        catch (e) {
                            var emoteName = self.$store.settings.copyPastaBtnEmote.val;
                            btnEmote = emoteName.__parseEmote(globalThis._ALL_EMOTES_REGEXP_, globalThis._ALL_EMOTES_);
                            if (btnEmote == emoteName) {
                                var err = 'invalid URL or this emote is not available';
                                self.showError(err);
                                log.error(err);
                                self.$store.settings.copyPastaBtnEmote.val = btnEmote = ERROR_EMOTES[randNumb(ERROR_EMOTES.length)];
                                btnEmote = check7TV_BTTV(btnEmote);
                            }
                        }
                        if ($newCopyPastaBtn instanceof Element && typeof btnEmote == 'string') {
                            $newCopyPastaBtn.innerHTML = btnEmote;
                        }
                        return $newCopyPastaBtn;
                    },
                    createEmote: globalThis.__createEmote,
                    parseEmotes: function (msg, streamer) {
                        var _this = this;
                        try {
                            if (streamer == void 0)
                                return;
                            if (msg.slice(-1) != ' ')
                                msg += ' ';
                            if (this.loading) {
                                setTimeout(function () { return _this.parseEmotes(msg); }, 4e3);
                                return msg;
                            }
                            msg = msg.replace(/(\<[a-z]{1}|\<\/)/gmi, function (e) { return __spreadArray([], e, true).join('&#13;'); });
                            if (checkForHTML(msg))
                                return msg;
                            return msg.split(" ").map(function (m) {
                                var _a;
                                return (_a = m.__parseEmote(_this._regexpGlobalEmotes, _this.allGlobalEmotes)) === null || _a === void 0 ? void 0 : _a.__parseEmote(_this._regexp_CHANNELS[streamer], _this.channelsEmotesObj[streamer]);
                            })
                                .map(function (e) { return /\<\/?span\>/g.test(e) ? e + '###' : e; }).join(" ").replace(/\#\#\# *[ ]/g, '');
                        }
                        catch (e) {
                            log.error(e);
                        }
                        ;
                    }
                };
            });
            return [2 /*return*/];
        });
    });
});
var FetchAllData = /** @class */ (function () {
    function FetchAllData($store) {
        this.$store = $store;
    }
    FetchAllData.prototype._get = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.globalEmotes()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.channelsEmotes()];
                    case 2:
                        _a.sent();
                        this.allEmotes();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    FetchAllData.prototype.fillStreamersInfoAsync = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.$store.pastasData.streamers
                            .map(function (streamer) { return __awaiter(_this, void 0, void 0, function () {
                            var channel, channelEmotes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getJSON(API_URL.channel, { name: streamer })];
                                    case 1:
                                        channel = _a.sent();
                                        return [4 /*yield*/, getJSON(API_URL.channelEmotes, { id: channel.id })];
                                    case 2:
                                        channelEmotes = _a.sent();
                                        return [2 /*return*/, {
                                                user: channel,
                                                emotes: channelEmotes
                                            }];
                                }
                            });
                        }); }))
                            .then(function (data) {
                            data.forEach(function (e, i) {
                                arr[i] = e;
                            });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, arr];
                }
            });
        });
    };
    FetchAllData.prototype.globalEmotes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, getJSON(API_URL.globalEmotes)];
                    case 1:
                        _a._globalEmotes = _b.sent();
                        this.allGlobalEmotes = [].concat.apply([], Object.values(this._globalEmotes));
                        this._regexpGlobalEmotes = new RegExp(this.allGlobalEmotes.map(function (e) {
                            return e.name.__createEmoteRegExp();
                        }).join(__makeTemplateObject(["|"], ["|"])), 'gm');
                        return [2 /*return*/];
                }
            });
        });
    };
    FetchAllData.prototype.channelsEmotes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.channelsInfo = [];
                        return [4 /*yield*/, this.fillStreamersInfoAsync(this.channelsInfo)];
                    case 1:
                        _a.sent();
                        this.channelsEmotesArr = this.channelsInfo
                            .map(function (e) {
                            var _a;
                            return (_a = {}, _a[e.user.broadcaster_login] = e.emotes, _a);
                        });
                        this.channelsEmotesObj = this.channelsEmotesArr.reduce(function (acc, v) {
                            var _a = Object.entries(v)[0], k = _a[0], reg = _a[1];
                            acc[k] = [].concat.apply([], Object.values(reg));
                            return acc;
                        }, {});
                        this.mergedChannelsEmotes = objectValuesMerge(this.channelsEmotesArr);
                        this._regexp_CHANNELS = this.channelsEmotesArr
                            .map(function (e) { return Object.entries(e)
                            .map(function (_a) {
                            var _b;
                            var k = _a[0], v = _a[1];
                            return (_b = {},
                                _b[k] = new RegExp(Object.values(v)
                                    .map(function (e) {
                                    return e.map(function (e) {
                                        return e.name.__createEmoteRegExp();
                                    }).join(__makeTemplateObject(["|"], ["|"]));
                                }), 'gm'),
                                _b);
                        }); }).reduce(function (acc, v) {
                            var _a = Object.entries(v[0])[0], k = _a[0], reg = _a[1];
                            acc[k] = reg;
                            return acc;
                        }, {});
                        return [2 /*return*/];
                }
            });
        });
    };
    FetchAllData.prototype.allEmotes = function () {
        var _a;
        this._ALL_EMOTES_ = [].concat.apply([], (_a = Object.values(this.mergedChannelsEmotes)).concat.apply(_a, Object.values(this._globalEmotes)));
        this._ALL_EMOTES_REGEXP_ = new RegExp(this._ALL_EMOTES_.map(function (e) {
            return e.name.__createEmoteRegExp();
        }).join(__makeTemplateObject(["|"], ["|"])), 'gm');
    };
    return FetchAllData;
}());
function log(msg) {
    console.info("%c[CopyPasta] %c".concat(msg), 'color: #9858FF', "color: #00B642");
}
;
function generateUID() {
    return 'cp-' + crypto.randomUUID();
}
;
function __createEmote(alt, src) {
    var img = new Image();
    var spanA = document.createElement('span'), spanB = document.createElement('span');
    var uid = generateUID();
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
            document.querySelector('span#' + uid).setAttribute('style', 'min-width: ' + img.width + 'px');
        }
        catch (e) {
            log.error('something weird happened when parsing emote.' + e);
        }
    };
    return spanA.outerHTML;
}
;
function check7TV_BTTV(source) {
    var src = new URL(source);
    var btnEmote = null;
    if ((src.origin.includes('7tv.app') || src.origin.includes('betterttv')) && /emote[s]?\/.*/.test(src.href)) {
        if (src.hostname.includes('cdn') && /\/emote\/.*\/[1-4]x\.webp/g.test(src.pathname)) {
            src = src.href.replace(/[234]x\.webp/, '1x.webp');
            btnEmote = __createEmote('', src);
        }
        else {
            src = "https://cdn.".concat(src.host.replace(/com/, 'net')).concat(src.pathname.replace(/emotes/, 'emote'), "/1x.webp");
            btnEmote = __createEmote('', src);
        }
    }
    else
        throw new Error('Only 7tv and betterttv is supported');
    return btnEmote;
}
;
function getJSON(url, params) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params !== void 0 && typeof params === 'object' && params.constructor.name === 'Object') {
                        url += '?' + Object.entries(params).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return "".concat(key, "=").concat(value);
                        }).join('&');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 2: return [2 /*return*/, (_a.sent()).json()];
                case 3:
                    e_2 = _a.sent();
                    log.error(e_2 + ' On fetching url: ' + url);
                    return [2 /*return*/, {}];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkForHTML(text) {
    var elem = document.createElement('div');
    elem.innerHTML = text;
    return !!elem.childElementCount;
}
function objectValuesMerge(arr) {
    //TODO: rewrite for universal use
    var result = [];
    arr.forEach(function (e) {
        result.push([].concat.apply([], Object.values(Object.values(e)[0]).map(function (e) { return Object.values(e); })));
    });
    return [].concat.apply([], result);
}
function randNumb(max, min) {
    if (min === void 0) { min = 0; }
    return Math.floor(Math.random() * (max - min) + min);
}
String.prototype.__parseEmote = function (regex, emotesData) {
    try {
        return this.replace(regex, function (e) { return __createEmote(e, emotesData.find(function (a) { return a.name == e.replace(/ /g, ''); }).image1x); });
    }
    catch (e) {
        log.error(e);
    }
    return this;
};
String.prototype.__createEmoteRegExp = function () {
    try {
        return this.replace(/[\\\/\)\(\;\:\>\<\_\-\+\}\{\[\]\.\?\|]/gm, function (e) { return "\\".concat(e); })
            .replace(/^.*$/gmi, function (e) { return "^ *".concat(e, " *$"); });
    }
    catch (e) {
        log.error(e);
    }
};

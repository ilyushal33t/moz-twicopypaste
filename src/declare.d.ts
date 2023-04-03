import { Alpine as AlpineType } from 'alpinejs'

declare global {
    var Alpine: AlpineType

    interface String {
        __parseEmote(regex: RegExp, emotesData: Array<EmotesData>): string,
        __createEmoteRegExp(): string,
        __parseEmotes(regexGlobal: RegExp, emotesGlobal: EmotesData[], regexChannel?: RegExp, emotesChannel?: EmotesData[]): string,
    }

    interface StreamerData {
        user: TwitchUserInfo,
        badges?: {}[],
        emotes: Array<{
            _7tv: EmotesData[],
            bttv: EmotesData[],
            twitch: EmotesData[],
            ffz: EmotesData[],
        }>,
    }

    /**
 * 
 * @interface PastasData
 * 
 * storing main data to local storage via Alpine`s $persist extension
 * 
 */

    interface PastasData {
        streamers: Array<string>,
        context: {
            name?: string,
            msg?: string,
            parsedCache?: string,
            uid?: string,
        },
    }

    interface TwitchUserInfo {
        broadcaster_language: string,
        broadcaster_login: string,
        display_name: string,
        game_id: string | number,
        game_name: string,
        id: string | number,
        is_live: boolean,
        tag_ids: any[],
        tags: string[],
        thumbnail_url: string,
        title: string,
        started_at: string,
    }

    interface EmotesData {
        name: string,
        image: string,
        image1x: string,
        zerowidth?: boolean, // zerowidth is only for 7tv
    }

}
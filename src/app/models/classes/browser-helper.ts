export class BrowserHelper {
    static isIE11(): boolean {
        return !!window.navigator.userAgent.match(/Trident/gi);
    }
}

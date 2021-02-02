export async function fetchHtml(url: string, init?: RequestInit): Promise<Document> {
    Object.assign(init ?? {}, { credentials: 'include', mode: 'cors' });
    return new DOMParser().parseFromString(await (await fetch(url, init)).text(), 'text/html');
}
export async function fetchJson(url: string, init?: RequestInit): Promise<any> {
    Object.assign(init ?? {}, { credentials: 'include', mode: 'cors' });
    return JSON.parse(await (await fetch(url, init)).text());
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export type Browser = 'firefox' | 'other';
export async function getBrowser(): Promise<Browser> {
    if (typeof browser?.runtime?.getBrowserInfo === 'function' && (await browser.runtime.getBrowserInfo()).name === 'Firefox') {
        return 'firefox';
    } else {
        return 'other';
    }
}
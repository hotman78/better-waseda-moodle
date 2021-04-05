import { CourseOverviewType } from '../../course-overview/components/CourseOverview';
import { YearTerm } from '../waseda/course/course';
import { CourseDataEntry } from '../waseda/course/course-data';

export type ConfigKey = keyof Config;
export type ConfigValue<T extends ConfigKey> = Config[T];
export type Config = {
    'autoLogin.enabled': boolean;
    'autoLogin.loginId': string;
    'autoLogin.password': string;
    'removeLoadingVideo.enabled': boolean;
    'viewInBrowser.enabled': boolean;
    'checkNotesOnSubmitting.enabled': boolean;
    'moreVisibleRemainingTime.enabled': boolean;
    'disableRateLimit.enabled': boolean;
    'courseOverview.enabled': boolean;
    'courseOverview.type': CourseOverviewType;
    'timetable.selectedTerm': YearTerm | null;
    'hideName.enabled': boolean;
    'syllabusLinkFix.enabled': boolean;
    'courseData': Record<number, CourseDataEntry | undefined>;
};

export const defaultValue: Config = {
    'autoLogin.enabled': false,
    'autoLogin.loginId': '',
    'autoLogin.password': '',
    'removeLoadingVideo.enabled': true,
    'viewInBrowser.enabled': false,
    'checkNotesOnSubmitting.enabled': true,
    'moreVisibleRemainingTime.enabled': true,
    'disableRateLimit.enabled': true,
    'courseOverview.enabled': true,
    'courseOverview.type': 'timetable',
    'timetable.selectedTerm': null,
    'hideName.enabled': false,
    'syllabusLinkFix.enabled': true,
    'courseData': {},
};

export const storage = browser.storage.local;
const listeners: { [key: string]: ((oldValue: any | undefined, newValue: any | undefined) => void)[]; } = {};

export async function getConfig<T extends ConfigKey>(key: T): Promise<ConfigValue<T>> {
    const value = (await storage.get(key))[key];
    if (value === undefined) {
        return defaultValue[key];
    } else {
        return value;
    }
}
export async function setConfig<T extends ConfigKey>(key: T, value: ConfigValue<T>): Promise<void> {
    await storage.set({ [key]: value });
}
export async function removeConfig<T extends ConfigKey>(key: T): Promise<void> {
    await storage.remove([key]);
}

export async function onConfigChange<T extends ConfigKey>(key: T, listener: (oldValue: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => void, initCall: boolean): Promise<void> {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(listener);
    if (initCall) listener(undefined, await getConfig(key));

    if (!browser.storage.onChanged.hasListener(storageChangeListener)) {
        browser.storage.onChanged.addListener(storageChangeListener);
    }
}

export function removeConfigChangeListener<T extends ConfigKey>(key: T, listener: (oldValue: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => void): boolean {
    if (!listeners[key]) return false;
    const index = listeners[key].indexOf(listener);
    if (index === -1) return false;
    listeners[key].splice(index, 1);
    return true;
}

function storageChangeListener(changes: Record<string, browser.storage.StorageChange>): void {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        listeners[key]?.forEach(listener => listener(oldValue, newValue ?? defaultValue[key as ConfigKey]));
    }
}
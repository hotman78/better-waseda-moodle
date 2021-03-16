import { initAutoLogin } from './auto-login/auto-login';
import { initConfigCache } from './common/config/config-cache';
import { MessengerServer } from './common/util/messenger';
import { initRemoveLoadingVideo } from './video/remove-loading-video/remove-loading-video';
import { initViewInBrowser } from './others/view-in-browser/view-in-browser';
import { initMoreVisibleRemainingTime } from './quiz/more-visible-remaining-time/more-visible-remaining-time';
import { initDisableRateLimit } from './others/disable-rate-limit/disable-rate-limit';
import { initSyllabusLinkFix } from './others/syllabus-link-fix/background-script';
// #!blink_only
import './common/polyfills/content-script-register';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfigCache();
    initAutoLogin();
    initRemoveLoadingVideo();
    initViewInBrowser();
    initMoreVisibleRemainingTime();
    initDisableRateLimit();
    initSyllabusLinkFix();
})();
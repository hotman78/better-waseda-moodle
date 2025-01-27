import registerContentScript from '../../common/config/registerContentScript';

export function initHideName(): void {
    registerContentScript('hideName.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/*'],
        css: [{ file: 'src/others/hide-name/style.css' }],
        runAt: 'document_start',
    });
}

import registerContentScript from '../common/config/registerContentScript';

export function initCourseOverview(): void {
    registerContentScript('courseOverview.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/my/*'],
        js: [{ file: 'src/course-overview/content-script.js' }],
        runAt: 'document_end',
    });
}

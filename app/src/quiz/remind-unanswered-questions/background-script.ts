import registerContentScript from '../../common/config/registerContentScript';

export function initRemindUnansweredQuestions(): void {
    registerContentScript('quiz.remindUnansweredQuestions.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        js: [{ file: 'src/quiz/remind-unanswered-questions/content-script.js' }],
        runAt: 'document_idle',
    });
}

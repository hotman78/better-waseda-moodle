import { Box } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import useConfig from '../../../../common/react/useConfig';

export default function OptionRemindUnansweredQuestions(): ReactElement | null {
    const [enabled] = useConfig('quiz.remindUnansweredQuestions.enabled');
    const [value, setValue] = useConfig('quiz.remindUnansweredQuestions.sequentialQuizOnly');

    if (enabled === undefined || value === undefined) return null;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.checked);
    }

    return (
        <Box ml={4}>
            <FormControlLabel
                control={<Switch checked={value} onChange={handleChange} disabled={!enabled} />}
                label={browser.i18n.getMessage('optionsQuizRemindUnansweredQuestionsSequentialQuizOnly')}
            />
        </Box>
    );
}
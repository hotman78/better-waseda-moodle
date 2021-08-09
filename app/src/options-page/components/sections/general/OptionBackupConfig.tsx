import Button from '@material-ui/core/Button';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import { exportConfig } from '../../../../common/config/config';

export default function OptionBackupConfig(): ReactElement {
    const handleBackupConfig = useCallback(async () => {
        const config = exportConfig();

        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, undefined, 2));
        a.download = 'better-waseda-moodle-' + formatDate(new Date()) + '.json';
        a.click();
    }, []);
    return (
        <Button variant="outlined" onClick={handleBackupConfig}>
            {browser.i18n.getMessage('optionsBackupConfig')}
        </Button>
    );
}

function formatDate(date: Date) {
    return (
        date.getFullYear() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')
    );
}

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { MessengerClient } from '../../../../common/util/messenger';
import Action from '../../options/Action';

export default React.memo(function OptionClearCourseListCache() {
    const [courseCacheClearedSnackbarOpen, setCourseCacheClearedSnackbarOpen] = useState(false);

    const handleClearCourseCache = useCallback(() => {
        MessengerClient.exec('clearCourseListCache').then(() => {
            setCourseCacheClearedSnackbarOpen(true);
        });
    }, []);
    const handleClearCourseListCacheMessageClose = useCallback(() => setCourseCacheClearedSnackbarOpen(false), []);

    return (
        <>
            <Action
                message="optionsClearCourseListCache"
                description="optionsClearCourseListCacheDescription"
                buttonMessage="optionsClearCourseListCacheButton"
                onClick={handleClearCourseCache}
            />

            <Snackbar
                open={courseCacheClearedSnackbarOpen}
                onClose={handleClearCourseListCacheMessageClose}
                autoHideDuration={5000}
            >
                <Alert severity="success" onClose={handleClearCourseListCacheMessageClose}>
                    {browser.i18n.getMessage('optionsClearCourseListCacheMessage')}
                </Alert>
            </Snackbar>
        </>
    );
});

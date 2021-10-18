import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';
import { useCallback } from 'react';
import BWMThemePrefersColorScheme from '../../common/react/theme/BWMThemePrefersColorScheme';
import { useCachedPromise } from '../../common/react/usePromise';
import { getToDoItems } from '../../common/todo-list/todo';
import Header from './Header';
import ToDoListView from './todo/ToDoListView';

const useStyles = makeStyles(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: '1fr 48px',
        width: '100%',
        height: '100%',
    },
}));

export default React.memo(function Popup() {
    return (
        <BWMThemePrefersColorScheme>
            <PopupContent />
        </BWMThemePrefersColorScheme>
    );
});

const PopupContent = React.memo(function Popup() {
    const classes = useStyles();

    const [refreshCounter, setRefreshCounter] = useState(0); //これをインクリメントすることでリストを更新する
    const [todoItems, state] = useCachedPromise(() => getToDoItems(refreshCounter !== 0), [refreshCounter]);

    const handleRefresh = useCallback(() => {
        setRefreshCounter((prev) => prev + 1);
    }, []);

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <ToDoListView loading={state !== 'fulfilled'} items={todoItems} onRefreshListRequest={handleRefresh} />
                <Header loading={state !== 'fulfilled'} onRefreshListRequest={handleRefresh} />
            </div>
        </>
    );
});

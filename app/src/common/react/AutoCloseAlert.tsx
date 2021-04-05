import Collapse from '@material-ui/core/Collapse';
import Alert, { Color } from '@material-ui/lab/Alert';
import React, { ReactElement, ReactNode, useState } from 'react';
import useTimer from './useTimer';

type Props = {
    severity: Color;
    open: boolean;
    onClose: () => void;
    timeout?: number;
    children?: ReactNode;
};

export default function AutoCloseAlert(props: Props): ReactElement | null {
    const [hover, setHover] = useState(false);

    useTimer(props.open && !hover, 3000, () => props.onClose());

    return (
        <Collapse in={props.open}>
            <Alert severity={props.severity} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                {props.children}
            </Alert>
        </Collapse>
    );
}

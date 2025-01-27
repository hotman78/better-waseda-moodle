import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { ReactElement, useContext, Ref } from 'react';
import { useCallback } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.memo(
    React.forwardRef(function HideCourseMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const context = useContext(CourseOverviewContext);

        const handleClick = useCallback(() => {
            context.hideCourse(props.course);
        }, [context, props.course]);

        return (
            <CourseMenuItem icon={<VisibilityOff />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                {browser.i18n.getMessage('courseOverviewHide')}
            </CourseMenuItem>
        );
    })
);

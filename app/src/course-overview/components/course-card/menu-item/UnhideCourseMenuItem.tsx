import Visibility from '@mui/icons-material/Visibility';
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
    React.forwardRef(function UnhideCourseMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const context = useContext(CourseOverviewContext);

        const handleClick = useCallback(() => {
            context.unhideCourse(props.course);
        }, [context, props.course]);

        return (
            <CourseMenuItem icon={<Visibility />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                {browser.i18n.getMessage('courseOverviewUnhide')}
            </CourseMenuItem>
        );
    })
);

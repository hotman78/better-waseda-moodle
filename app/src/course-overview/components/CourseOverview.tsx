import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import { onConfigChange, removeConfigChangeListener } from '../../common/config/config';
import { Course, CourseListItem } from '../../common/waseda/course/course';
import BWMThemeDarkReader from '../../common/react/theme/BWMThemeDarkReader';
import CenteredCircularProgress from '../../common/react/CenteredCircularProgress';
import useConfig from '../../common/react/useConfig';
import { courseData, courseList, messengerClient } from '../content-script';
import NormalView from './normal/NormalView';
import TimetableView from './timetable/TimetableView';
import { CourseDataEntry } from '../../common/waseda/course/course-data';

export type CourseOverviewType = 'normal' | 'timetable';

export type CourseOverviewContextProps = {
    courseList: CourseListItem[];
    courseData: Record<number, CourseDataEntry | undefined>;
    hideCourse: (course: Course) => void;
    unhideCourse: (course: Course) => void;
};
export const CourseOverviewContext = createContext<CourseOverviewContextProps>({
    courseList: [],
    courseData: {},
    hideCourse: () => { /* do nothing */ },
    unhideCourse: () => { /* do nothing */ },
});

export default function CourseOverview(): ReactElement {
    const [courseList, setHiddenFromCourseList] = useCourseList();
    const courseData = useCourseData();
    const [courseOverviewType] = useConfig('courseOverview.type');

    const contextValue = useMemo<CourseOverviewContextProps | undefined>(() => courseList && courseData && ({
        courseList,
        courseData,
        hideCourse: course => {
            setHiddenFromCourseList(course, true);
        },
        unhideCourse: course => {
            setHiddenFromCourseList(course, false);
        },
    }), [courseData, courseList, setHiddenFromCourseList]);

    if (contextValue && courseOverviewType) {
        return (
            <BWMThemeDarkReader>
                <CourseOverviewContext.Provider value={contextValue}>
                    {(() => {
                        switch (courseOverviewType) {
                            case 'normal':
                                return <NormalView />;
                            case 'timetable':
                                return <TimetableView />;
                        }
                    })()}
                </CourseOverviewContext.Provider>
            </BWMThemeDarkReader>
        );
    } else {
        return (
            <BWMThemeDarkReader>
                <CenteredCircularProgress />
            </BWMThemeDarkReader>
        );
    }
}

function useCourseList(): [CourseListItem[] | undefined, (course: Course, isHidden: boolean) => void] {
    const [courseListValue, setCourseListValue] = useState<CourseListItem[] | undefined>(undefined);
    useEffect(() => {
        let isCancelled = false;
        courseList.then(value => {
            if (!isCancelled) setCourseListValue(value);
        });
        return () => {
            isCancelled = true;
        };
    }, []);

    const setHiddenFromCourseList = (course: Course, isHidden: boolean) => {
        messengerClient.exec('setHiddenFromCourseList', course, isHidden);
        setCourseListValue(
            courseListValue?.map(c =>
                c.id === course.id ?
                    {
                        ...c,
                        isHidden,
                    } :
                    c,
            ),
        );
    };

    return [courseListValue, setHiddenFromCourseList];
}

function useCourseData(): Record<number, CourseDataEntry | undefined> | undefined {
    const [courseDataValue, setCourseDataValue] = useState<Record<number, CourseDataEntry | undefined> | undefined>(undefined);
    useEffect(() => {
        let isCancelled = false;

        courseData.then(value => {
            if (!isCancelled) setCourseDataValue(value);
        });

        const listener = (_: Record<number, CourseDataEntry | undefined> | undefined, value: Record<number, CourseDataEntry | undefined>) => {
            setCourseDataValue(value);
        };
        onConfigChange('courseData', listener, false);

        return () => {
            isCancelled = true;
            removeConfigChangeListener('courseData', listener);
        };
    }, []);

    return courseDataValue;
}
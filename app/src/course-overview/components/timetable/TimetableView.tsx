import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { ReactElement, useContext, useMemo, useState } from 'react';
import { uniqueYearTerms, yearTermEquals } from '../../../common/waseda/course/course';
import useConfig from '../../../common/react/useConfig';
import CourseListView from '../CourseListView';
import { CourseOverviewContext } from '../CourseOverview';
import HiddenCoursesDialog from '../dialog/HiddenCoursesDialog';
import Timetable from './Timetable';
import TimetableTermSelector from './TimetableTermSelector';
import { useCallback } from 'react';

export default React.memo(function TimetableView(): ReactElement {
    const { courseList, courseData } = useContext(CourseOverviewContext);
    const [hiddenCoursesDialogOpen, setHiddenCoursesDialogOpen] = useState(false);

    const handleOpenHiddenCoursesDialog = useCallback(() => {
        setHiddenCoursesDialogOpen(true);
    }, []);
    const handleCloseHiddenCoursesDialog = useCallback(() => {
        setHiddenCoursesDialogOpen(false);
    }, []);

    // TimetableTermSelectorに表示するYearTerm
    const terms = useMemo(
        () =>
            uniqueYearTerms(
                courseList.flatMap(
                    (course) => courseData[course.id]?.timetableData?.map((entry) => entry.yearTerm) ?? []
                )
            ),
        [courseData, courseList]
    );

    // 時間割表の下に表示する
    const coursesNotInTimetable = useMemo(
        () => courseList.filter((course) => (courseData[course.id]?.timetableData?.length ?? 0) === 0),
        [courseData, courseList]
    );

    const [selectedTerm, setSelectedTerm] = useConfig('timetable.selectedTerm');
    const [showPeriodTime] = useConfig('timetable.showPeriodTime');

    let selectedTermIndex;
    if (terms.length === 0) {
        if (selectedTerm !== null) setSelectedTerm(null);
        selectedTermIndex = null;
    } else if (selectedTerm !== null) {
        const index = terms.findIndex((t) => yearTermEquals(selectedTerm, t));
        if (index === -1) {
            selectedTermIndex = 0;
            setSelectedTerm(terms[0]);
        } else selectedTermIndex = index;
    } else {
        selectedTermIndex = 0;
        setSelectedTerm(terms[0]);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item>
                    <TimetableTermSelector terms={terms} selectedIndex={selectedTermIndex} onChange={setSelectedTerm} />
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={handleOpenHiddenCoursesDialog}>
                        {browser.i18n.getMessage('courseOverviewHiddenCourses')}
                    </Button>
                    <HiddenCoursesDialog open={hiddenCoursesDialogOpen} onClose={handleCloseHiddenCoursesDialog} />
                </Grid>
            </Grid>

            {selectedTerm && <Timetable selectedTerm={selectedTerm} showPeriodTime={showPeriodTime} />}

            <CourseListView courses={coursesNotInTimetable.filter((c) => !c.isHidden)} />
        </>
    );
});

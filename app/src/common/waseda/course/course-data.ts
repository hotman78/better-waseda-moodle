import AsyncLock from 'async-lock';
import { ConfigValue, getConfig, setConfig } from '../../config/config';
import { TimetableConflictError } from '../../error';
import { DeepReadonly } from '../../util/types';
import { containsYearTerm, DayPeriod, YearTerm } from './course';

export type CourseDataEntry = {
    overrideName?: string;
    overrideImage?: CourseImage;
    timetableData?: TimetableEntry[];
    syllabusUrl?: string;
    note?: string;
};

export type CourseImage = CourseImageUrl | CourseImageSolidColor;
export type CourseImageUrl = {
    type: 'url';
    url: string;
};
export type CourseImageSolidColor = {
    type: 'solid_color';
    r: number;
    g: number;
    b: number;
};

export type TimetableEntry = {
    yearTerm: YearTerm;
    dayPeriod: DayPeriod;
};

const lock = new AsyncLock();
export async function registerCourseData<T extends keyof CourseDataEntry>(
    courseId: number,
    key: T,
    value: DeepReadonly<CourseDataEntry[T]>,
    overrideConflict?: boolean
): Promise<void> {
    lock.acquire('registerCourseData', async () => {
        const configValue = getConfig('courseData');

        if (key === 'timetableData') {
            await checkTimetableConflict(configValue, courseId, (value ?? []) as TimetableEntry[], overrideConflict);
        }

        const newConfigValue = {
            ...configValue,
            [courseId]: {
                ...configValue[courseId],
                [key]: value,
            },
        };

        setConfig('courseData', newConfigValue);
    });
}

async function checkTimetableConflict(
    courseData: ConfigValue<'courseData'>,
    courseId: number,
    entries: NonNullable<CourseDataEntry['timetableData']>,
    overrideConflict?: boolean
): Promise<void> {
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        for (const [id, courseDataEntry] of Object.entries(courseData)) {
            if (id === courseId.toString() || !courseDataEntry?.timetableData) continue;

            const conflictIndices: number[] = [];
            for (let j = 0; j < courseDataEntry.timetableData.length; j++) {
                const { yearTerm, dayPeriod } = courseDataEntry.timetableData[j];

                if (
                    (containsYearTerm(yearTerm, entry.yearTerm) || containsYearTerm(entry.yearTerm, yearTerm)) &&
                    dayPeriod.day === entry.dayPeriod.day &&
                    dayPeriod.period.from <= entry.dayPeriod.period.to &&
                    entry.dayPeriod.period.from <= dayPeriod.period.to
                ) {
                    if (overrideConflict) {
                        conflictIndices.push(j);
                    } else {
                        throw new TimetableConflictError();
                    }
                }
            }
            if (conflictIndices.length > 0) {
                await registerCourseData(
                    parseInt(id),
                    'timetableData',
                    courseDataEntry.timetableData.filter((_, i) => !conflictIndices.includes(i))
                );
            }
        }

        for (let j = 0; j < i; j++) {
            if (
                (containsYearTerm(entries[j].yearTerm, entry.yearTerm) ||
                    containsYearTerm(entry.yearTerm, entries[j].yearTerm)) &&
                entries[j].dayPeriod.day === entry.dayPeriod.day &&
                entries[j].dayPeriod.period.from <= entry.dayPeriod.period.to &&
                entry.dayPeriod.period.from <= entries[j].dayPeriod.period.to
            ) {
                throw new TimetableConflictError();
            }
        }
    }
}

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import MoreVert from '@mui/icons-material/MoreVert';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { useMediaQuery } from '../../../common/polyfills/useMediaQuery';
import { CourseOverviewContext } from '../CourseOverview';
import CourseImage from '../course-card/CourseImage';
import CourseMenu from '../course-card/CourseMenu';
import NoteIcon from '@mui/icons-material/Note';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { useCallback } from 'react';

type Props = {
    course: CourseListItem;
};

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    },
    title: {
        color: theme.palette.text.primary,
    },
    cardMediaRoot: {
        objectPosition: 'center top',
    },
    cardHeaderRoot: {
        alignItems: 'flex-start',
        [theme.breakpoints.between('sm', 'xl')]: {
            padding: theme.spacing(1),
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            padding: theme.spacing(1 / 2),
        },
    },
    cardHeaderTypographyRoot: {
        wordBreak: 'break-all',
        [theme.breakpoints.down('md')]: {
            fontSize: '0.8rem',
            lineHeight: '1.2em',
        },
    },
    cardHeaderAction: {
        marginTop: -4,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    listItemIconRoot: {
        minWidth: 40,
    },
    noteTooltip: {
        whiteSpace: 'break-spaces',
    },
}));

export default React.memo(function CourseCard(props: Props): ReactElement {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
    const context = useContext(CourseOverviewContext);

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const courseData = context.courseData[props.course.id];
    const courseName = courseData?.overrideName ?? props.course.name;

    const handleOpenMenuButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }, []);
    const closeMenu = useCallback(() => {
        setMenuOpen(false);
    }, []);
    const handleContextMenu: React.MouseEventHandler = useCallback(
        (event) => {
            if (!menuOpen) {
                event.preventDefault();
                setAnchorPosition({ top: event.clientY, left: event.clientX });
                setMenuOpen(true);
            }
        },
        [menuOpen]
    );

    return (
        <Card className={classes.root} onContextMenu={isSmallScreen ? handleContextMenu : undefined}>
            <CourseImage
                alt={courseName}
                height="8"
                title={courseName}
                course={props.course}
                classes={{ cardMediaRoot: classes.cardMediaRoot }}
            />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                    root: classes.cardHeaderRoot,
                }}
                title={
                    <Typography variant="body1" classes={{ root: classes.cardHeaderTypographyRoot }}>
                        <a
                            className={classes.title}
                            href={`https://wsdmoodle.waseda.jp/course/view.php?id=${props.course.id}`}
                        >
                            {courseName}
                        </a>
                    </Typography>
                }
                action={
                    <Grid container direction="column">
                        <Grid item>
                            <IconButton edge={false} size="small" onClick={handleOpenMenuButtonClick}>
                                <MoreVert />
                            </IconButton>
                        </Grid>
                        {courseData?.note ? (
                            <Grid item>
                                <Tooltip
                                    classes={{ tooltip: classes.noteTooltip }}
                                    title={<Typography variant="body1">{courseData?.note}</Typography>}
                                >
                                    <IconButton edge={false} size="small">
                                        <NoteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        ) : null}
                    </Grid>
                }
            />
            <CourseMenu
                course={props.course}
                anchorEl={isSmallScreen ? undefined : anchorEl}
                anchorPosition={isSmallScreen ? anchorPosition : undefined}
                anchorReference={isSmallScreen ? 'anchorPosition' : 'anchorEl'}
                open={menuOpen}
                onClose={closeMenu}
            />
        </Card>
    );
});

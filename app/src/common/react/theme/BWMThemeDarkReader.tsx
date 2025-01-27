import { PaletteOptions, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider, createTheme, Theme } from '@mui/material/styles';
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { bwmThemeOptions } from './BWMTheme';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

// DarkReaderで設定された背景色と文字色を取得する
function useDarkReaderColor(): { bgR: number; bgG: number; bgB: number; fgR: number; fgG: number; fgB: number } | null {
    const style = getComputedStyle(document.documentElement);
    const [bgColor, setBgColor] = useState(style.getPropertyValue('--darkreader-neutral-background').trim());
    const [fgColor, setFgColor] = useState(style.getPropertyValue('--darkreader-neutral-text').trim());

    useEffect(() => {
        //darkreaderによるstyleの変更を監視する
        const observer = new MutationObserver((records) => {
            for (const record of records) {
                if (
                    Array.from(record.addedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains('darkreader')
                    ) ||
                    Array.from(record.removedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains('darkreader')
                    ) ||
                    (record.target.parentNode instanceof HTMLStyleElement &&
                        record.target.parentNode.classList.contains('darkreader'))
                ) {
                    const style = getComputedStyle(document.documentElement);
                    setBgColor(style.getPropertyValue('--darkreader-neutral-background').trim());
                    setFgColor(style.getPropertyValue('--darkreader-neutral-text').trim());
                    return;
                }
            }
        });
        observer.observe(document.head, { subtree: true, characterData: true, childList: true });
        return () => observer.disconnect();
    }, []);

    return useMemo(() => {
        if (!bgColor || !fgColor) return null;

        return {
            bgR: parseInt(bgColor.substr(1, 2), 16),
            bgG: parseInt(bgColor.substr(3, 2), 16),
            bgB: parseInt(bgColor.substr(5, 2), 16),
            fgR: parseInt(fgColor.substr(1, 2), 16),
            fgG: parseInt(fgColor.substr(3, 2), 16),
            fgB: parseInt(fgColor.substr(5, 2), 16),
        };
    }, [bgColor, fgColor]);
}

function useDarkReaderTheme(): Theme {
    const darkReaderColor = useDarkReaderColor();

    return useMemo(() => {
        if (!darkReaderColor) {
            return createTheme(bwmThemeOptions);
        }

        const { bgR, bgG, bgB, fgR, fgG, fgB } = darkReaderColor;

        const isDark = bgR + bgG + bgB < 500;
        const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r},${g},${b},${a})`;
        let palette: PaletteOptions;
        if (isDark) {
            palette = {
                mode: 'dark',
                text: {
                    primary: rgba(fgR, fgG, fgB, 1),
                    secondary: rgba(fgR, fgG, fgB, 0.7),
                    disabled: rgba(fgR, fgG, fgB, 0.5),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR + 10, bgG + 10, bgB + 10, 1),
                },
                divider: rgba(fgR, fgG, fgB, 0.12),
            };
        } else {
            palette = {
                mode: 'light',
                text: {
                    primary: rgba(fgR, fgG, fgB, 0.87),
                    secondary: rgba(fgR, fgG, fgB, 0.54),
                    disabled: rgba(fgR, fgG, fgB, 0.38),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR, bgG, bgB, 1),
                },
            };
        }

        const newTheme = createTheme({
            ...bwmThemeOptions,
            palette: {
                ...bwmThemeOptions.palette,
                ...palette,
            },
        });

        return newTheme;
    }, [darkReaderColor]);
}

export default React.memo(function BWMThemeDarkReader(props: { children?: ReactNode }): ReactElement {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={useDarkReaderTheme()}>{props.children}</ThemeProvider>
        </StyledEngineProvider>
    );
});

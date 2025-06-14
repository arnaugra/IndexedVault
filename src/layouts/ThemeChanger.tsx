import { useEffect, useRef, useState } from "react";
import { Config } from "../db/Config";
import SunIcon from "../svg/SunIcon";
import MoonIcon from "../svg/MoonIcon";

type Themes = 'dark' | 'light';

function ThemeChanger () {
    const [theme, setTheme] = useState<Themes>('dark');
    const initialized = useRef(false);
    const handleChangeTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        await Config.create({ name: 'theme', value: newTheme });
    }

    const fetchTheme = async () => {
        const currentTheme = await Config.getByName('theme');
        if (currentTheme) {
            setTheme(currentTheme.value as Themes);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            const newTheme = prefersDark ? 'dark' : 'light';
            setTheme(newTheme);
            await Config.create({ name: 'theme', value: newTheme });
        }
    }
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        fetchTheme();
    }, []);

    return (
        <>
            <input type="checkbox" value={theme} checked={theme === 'light'} className="theme-controller hidden" onChange={() => {}}/> {/* Using `onchange` to prevent an error log */}
            <button className="btn btn-circle btn-ghost" onClick={handleChangeTheme}>{theme === 'light' ? <MoonIcon className="w-5" /> : <SunIcon className="w-5" />}</button>
        </>

    )
}

export default ThemeChanger;

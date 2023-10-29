'use client';
import { useTheme } from '@/context/ThemeProvider';

import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const Theme = () => {
    const { mode, setMode } = useTheme();

    return (
        <Button
            size="icon"
            onClick={() => {
                setMode(mode === 'dark' ? 'light' : 'dark');
                mode === 'dark' ? (localStorage.theme = 'light') : (localStorage.theme = 'dark');
            }}
        >
            {mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
    );
};

export default Theme;

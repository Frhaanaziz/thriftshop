'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const Theme = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
    );
};

export default Theme;

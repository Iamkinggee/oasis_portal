'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('oasis-theme');
    if (saved === 'dark') setDark(true);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      localStorage.setItem('oasis-theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  return { dark, toggleTheme };
}

export function getTokens(dark: boolean) {
  return {
    outerBg:      dark ? 'bg-black'        : 'bg-[#f0f0ed]',
    formPanelBg:  dark ? 'bg-zinc-950'     : 'bg-white',
    headline:     dark ? 'text-white'      : 'text-zinc-900',
    subtitle:     dark ? 'text-zinc-400'   : 'text-zinc-500',
    label:        dark ? 'text-zinc-300'   : 'text-zinc-700',
    muted:        dark ? 'text-zinc-500'   : 'text-zinc-400',
    logoAccent:   'text-orange-400',
    inputBg:      dark ? 'bg-zinc-900'     : 'bg-[#f5f5f2]',
    inputBorder:  dark ? 'border-zinc-700' : 'border-zinc-200',
    inputFocus:   dark ? 'focus:border-zinc-500 focus:ring-zinc-500/30'
                       : 'focus:border-zinc-400 focus:ring-zinc-400/20',
    inputText:    dark ? 'text-white'      : 'text-zinc-900',
    placeholder:  dark ? 'placeholder-zinc-500' : 'placeholder-zinc-400',
    googleBorder: dark ? 'border-zinc-700' : 'border-zinc-200',
    googleBg:     dark ? 'bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500'
                       : 'bg-white hover:bg-zinc-50 hover:border-zinc-300',
    googleText:   dark ? 'text-white'      : 'text-zinc-800',
    dividerLine:  dark ? 'border-zinc-800' : 'border-zinc-200',
    dividerLabel: dark ? 'bg-zinc-950 text-zinc-500' : 'bg-white text-zinc-400',
    submitIdle:   dark ? 'bg-black text-white border-white/10 hover:bg-white hover:text-black'
                       : 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-700',
    link:         dark ? 'text-white hover:text-orange-300'
                       : 'text-zinc-900 hover:text-orange-500',
    forgotLink:   dark ? 'text-zinc-500 hover:text-orange-300'
                       : 'text-zinc-400 hover:text-orange-500',
    toggle:       dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                       : 'bg-zinc-100 border-zinc-200 text-zinc-700',
  };
}
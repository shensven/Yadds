import { atom } from 'jotai';

export const atomSidebarWidth = atom<240>(240);

export const atomOS = atom(window.electron?.os.get());

export const atomAppVersion = atom(window.electron?.app.getVersion());

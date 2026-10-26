const KEY = 'sft:data';
const SETTINGS_KEY = 'sft:settings';

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}
export const load = () => read(KEY, []);
export const save = data => localStorage.setItem(KEY, JSON.stringify(data));
export const loadSettings = () => read(SETTINGS_KEY, {});
export const saveSettings = s => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));

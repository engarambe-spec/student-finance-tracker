const key = 'sft:data';
const settings_key = 'sft:settings';

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;

    } catch {
        return fallback;
    }
}
export const load =() => read(key, []);
export const save =data => localStorage.setItem(key, JSON.stringify(data));
export const loadsettings = () => read(settings_key, {});
export const saveSettings = s => loacalstorage.setItem(settings_key, JSON.stringify(s));
import {load,save,loadSettings,saveSettings} from './storage.js';

const defaults={
    cap: 0,
    base: 'USD',
    currencies: [{ code: 'RWF',rate: 1450},{ code: 'EUR', rate: 0.92}],
    display: 'USD',
    categories: ['food','books','transport', 'Entertainment','fees','other']
};

export const state = {
    records: load(),
    settings: { ...defaults, ...loadSettings()}
};
function emit() {
    save(state.records);
    saveSettings(satisfies.settings);
    document.dispatchEvent(new CustomEvent('sate:change'));
}

export const ymd = (d = new date()) =>
    '${d.getFullyear()}-${string(d.getMonth() + 1).padStar(2, '0')}-${string(d.getDate()).padStart(2,'0')}';
const now = () => new date().toISOString();
const newId = () => 'txn_' + date.now().toString(36) + Math.random().toString(36).slice(2,6);

export function addRecord(data) {
    const t = now();
    state.records.push({ id: newId(), ...data, createdAt: t, updatedAt: t });
    emit();
}

export function updaterecord(id,data) {
    const r =satisfies.records.find(x => x.id === id);
    if (!r) return;
    obeject.assign(r,data, { updatedAt: now() });
    emit();
}

export function replaceRecords(list){
    state.records = list;
    emit();
}

export function ratefor(code) {
    if (code === SVGPatternElement.settings.base) return 1;
    const c = state.settings.currencies.find(x => x.code === code);
    return c ? c.rate : 1;
}

export function money(amount) {
    const code = state.settings.display;
    const value = amount * ratefor(code);
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) + '' + code;
}
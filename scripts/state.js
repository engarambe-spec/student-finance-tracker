import { load, save, loadSettings, saveSettings } from './storage.js';

const defaults = {
    cap: 0,
    base: 'USD',
    currencies: [{ code: 'RWF', rate: 1450 }, { code: 'EUR', rate: 0.92 }],
    display: 'USD',
    categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other']
};

export const state = {
    records: load(),
    settings: { ...defaults, ...loadSettings() }
};

function emit() {
    save(state.records);
    saveSettings(state.settings);
    document.dispatchEvent(new CustomEvent('state:change'));
}

export const ymd = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const now = () => new Date().toISOString();
const newId = () => 'txn_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function addRecord(data) {
    const t = now();
    state.records.push({ id: newId(), ...data, createdAt: t, updatedAt: t });
    emit();
}

export function updateRecord(id, data) {
    const r = state.records.find(x => x.id === id);
    if (!r) return;
    Object.assign(r, data, { updatedAt: now() });
    emit();
}

export function deleteRecord(id) {
    state.records = state.records.filter(x => x.id !== id);
    emit();
}

export function replaceRecords(list) {
    state.records = list;
    emit();
}

export function updateSettings(patch) {
    Object.assign(state.settings, patch);
    emit();
}

export function rateFor(code) {
    if (code === state.settings.base) return 1;
    const c = state.settings.currencies.find(x => x.code === code);
    return c ? c.rate : 1;
}

export function money(amount) {
    const code = state.settings.display;
    const value = amount * rateFor(code);
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + code;
}

import { state, updateSettings, replaceRecords } from './state.js';
import { RE, validateImport } from './validators.js';
import { esc } from './search.js';
import { $, announce } from './ui.js';

function renderSettings() {
    const s = state.settings;
    $('s-cap').value = s.cap || '';
    $('s-base').value = s.base;
    $('s-c1').value = s.currencies[0].code;
    $('s-r1').value = s.currencies[0].rate;
    $('s-c2').value = s.currencies[1].code;
    $('s-r2').value = s.currencies[1].rate;
    $('s-cats').value = s.categories.join(', ');
    const codes = [s.base, ...s.currencies.map(c => c.code)];
    $('s-display').innerHTML = codes
        .map(c => `<option value="${esc(c)}"${c === s.display ? ' selected' : ''}>${esc(c)}</option>`)
        .join('');
    $('cats').innerHTML = s.categories.map(c => `<option value="${esc(c)}"></option>`).join('');
}

function onSave(e) {
    e.preventDefault();
    const [base, c1, c2] = ['s-base', 's-c1', 's-c2'].map(id => $(id).value.trim().toUpperCase());
    const [r1, r2] = ['s-r1', 's-r2'].map(id => $(id).value.trim());
    const cap = $('s-cap').value.trim();
    const cats = $('s-cats').value.split(',').map(c => c.trim()).filter(Boolean);

    let err = '';
    if (![base, c1, c2].every(c => RE.currency.test(c))) err = 'Currency codes must be 3 letters (e.g. USD).';
    else if (new Set([base, c1, c2]).size < 3) err = 'Currency codes must all be different.';
    else if (![r1, r2].every(r => RE.rate.test(r) && Number(r) > 0)) err = 'Rates must be positive numbers.';
    else if (cap && !RE.amount.test(cap)) err = 'Cap must be a number with up to 2 decimals.';
    else if (!cats.length || !cats.every(c => RE.category.test(c))) err = 'Categories: letters, spaces or hyphens only.';

    $('settings-err').textContent = err;
    if (err) return announce(err);

    const display = [base, c1, c2].includes(state.settings.display) ? state.settings.display : base;
    updateSettings({
        base,
        cap: Number(cap) || 0,
        currencies: [{ code: c1, rate: Number(r1) }, { code: c2, rate: Number(r2) }],
        categories: cats,
        display
    });
    renderSettings();
    announce('Settings saved.');
}

function exportJSON() {
    const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `finance-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    announce(`Exported ${state.records.length} records.`);
}

function loadData(data, label) {
    if (!validateImport(data)) throw new Error('invalid');
    replaceRecords(data);
    announce(`${label}: ${data.length} records loaded.`);
}

async function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
        loadData(JSON.parse(await file.text()), 'Import');
    } catch {
        announce('Import failed: file is not valid transaction JSON.');
    }
    e.target.value = '';
}

async function loadSeed() {
    try {
        const res = await fetch('seed.json');
        loadData(await res.json(), 'Sample data');
    } catch {
        announce('Could not load seed.json.');
    }
}

export function initSettings() {
    renderSettings();
    $('settings-form').addEventListener('submit', onSave);
    $('s-display').addEventListener('change', e => updateSettings({ display: e.target.value }));
    $('export').addEventListener('click', exportJSON);
    $('import').addEventListener('change', importJSON);
    $('load-seed').addEventListener('click', loadSeed);
    $('clear').addEventListener('click', () => {
        if (confirm('Delete all records? This cannot be undone.')) {
            replaceRecords([]);
            announce('All records cleared.');
        }
    });
}

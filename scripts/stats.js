import { state, money, ymd } from './state.js';
import { $ } from './ui.js';

export function computeStats(records = state.records) {
    const sum = records.reduce((s, r) => s + r.amount, 0);
    const byCat = {};
    records.forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + r.amount; });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = ymd(d);
        days.push({ key, total: records.filter(r => r.date === key).reduce((s, r) => s + r.amount, 0) });
    }
    return { count: records.length, sum, top: top ? top[0] : '—', days };
}

function renderCap(sum) {
    const msg = $('cap-msg');
    const cap = Number(state.settings.cap);
    if (!cap) {
        msg.className = 'cap-msg';
        msg.setAttribute('aria-live', 'polite');
        msg.textContent = 'No spending cap set.';
        return;
    }
    const diff = cap - sum;
    const over = diff < 0;
    msg.className = 'cap-msg ' + (over ? 'over' : 'ok');
    msg.setAttribute('aria-live', over ? 'assertive' : 'polite');
    msg.textContent = over
        ? `Over cap by ${money(-diff)} (cap ${money(cap)}).`
        : `${money(diff)} remaining of ${money(cap)} cap.`;
}

export function renderStats() {
    const s = computeStats();
    $('stat-count').textContent = s.count;
    $('stat-sum').textContent = money(s.sum);
    $('stat-top').textContent = s.top;
    const max = Math.max(...s.days.map(d => d.total), 1);
    $('chart').innerHTML = s.days.map(d => `
        <div class="bar-wrap">
            <div class="bar" style="height:${Math.round((d.total / max) * 120)}px" title="${d.key}: ${money(d.total)}"></div>
            <span>${d.key.slice(5)}</span>
        </div>`).join('');
    $('chart').setAttribute('aria-label', 'Spending last 7 days: ' + s.days.map(d => `${d.key} ${money(d.total)}`).join('; '));
    renderCap(s.sum);
}

export function initStats() {
    document.addEventListener('state:change', renderStats);
    renderStats();
}

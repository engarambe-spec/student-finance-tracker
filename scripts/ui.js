export const $ = id => document.getElementById(id);

export function announce(msg) {
    const el = $('status');
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = msg; });
}

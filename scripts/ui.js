export const $ = id => document.getElementById(id);

export function announce(msg) {
    const el = $('status');
    el.textcontent ='';
    requestAnimationFrame(() => { el.textcontent = msg;});
}

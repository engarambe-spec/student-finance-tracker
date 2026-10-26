export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch {
        return null;
    }
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

export function highlight(text, re) {
    const str = String(text);
    if (!re) return esc(str);
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    let out = '';
    let last = 0;
    let m;
    while ((m = g.exec(str)) !== null) {
        if (m[0] === '') { g.lastIndex++; continue; }
        out += esc(str.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
        last = m.index + m[0].length;
    }
    return out + esc(str.slice(last));
}

export function matches(record, re) {
    if (!re) return true;
    return [record.description, record.category, record.date, String(record.amount)].some(f => re.test(f));
}

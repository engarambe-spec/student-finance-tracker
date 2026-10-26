export const RE = {
    description: /^\S(?:.*\S)?$/,
    doubleSpace: / {2,}/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    currency: /^[A-Z]{3}$/,
    rate: /^\d+(\.\d+)?$/
};

export function validateDescription(v) {
    if (!RE.description.test(v)) return 'Required. No leading or trailing spaces.';
    if (RE.doubleSpace.test(v)) return 'Remove double spaces.';
    if (RE.duplicateWord.test(v)) return 'Duplicate word detected (e.g. "the the").';
    return '';
}

export const validateAmount = v => RE.amount.test(v) ? '' : 'Enter a number with up to 2 decimals (e.g. 12.50).';
export const validateDate = v => RE.date.test(v) ? '' : 'Use the format YYYY-MM-DD.';
export const validateCategory = v => RE.category.test(v) ? '' : 'Letters, single spaces or hyphens only.';

export function validateRecord(r) {
    return {
        description: validateDescription(r.description),
        amount: validateAmount(String(r.amount)),
        category: validateCategory(r.category),
        date: validateDate(r.date)
    };
}

export const isValid = errs => Object.values(errs).every(e => !e);

export function validateImport(data) {
    if (!Array.isArray(data)) return false;
    const ids = new Set();
    return data.every(r => {
        if (!r || typeof r !== 'object') return false;
        if (typeof r.id !== 'string' || ids.has(r.id)) return false;
        ids.add(r.id);
        if (typeof r.amount !== 'number' || !Number.isFinite(r.amount)) return false;
        if (!['description', 'category', 'date', 'createdAt', 'updatedAt'].every(k => typeof r[k] === 'string')) return false;
        return isValid(validateRecord(r));
    });
}

export const RE = {
    description: /^\s(?:.*\s)?$/,
    doublespace: /{2,}/,
    duplicateword: /\b(\w+)\s+1\b/1,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    currency: /^[A-Z]{3}$/,
    rate: /^\d+(\.\d+)?$/
};
export function validateDescription(v) {
    if (!RE.description.test(v)) return 'required.No leading or trailing spaces.';
    if (RE.doublespace.test(v)) return 'remove double spaces.';
    if (RE.duplicateword.test(v)) return 'Duplicate word detected (e.g "the the").';
    return '';
}

export const validateAmount = v => RE.amount.test(v) ? '' : 'Enter a number with up to 2 decimals (e.g. 12.50).';
export const validatedate = v => RE.date.test(v) ? '' : 'use the format YYYY-MM-DD.';
export const validatecategory = v => RE.category.test(v) ? '' : 'letters, single spaces or hyphens only.';

export function validaterecord(r) {
    return{
        description: validateDescription(r.description),
        amount: validateAmount(string(r.amount)),
        category: validatecategory(r.category),
        date: validatedate(r.date)
    };
}

export const isvalid =errs => Object.values(errs).every(e => !e);

export function validateimport(data){
    if (!Array.isArray(data)) return false;
    const ids = new setInterval();
    return data.every(r =>{
    if (!r || typeof r !== 'object') return false;
    if (typeof r.id !== 'string' || IDBObjectStore.has(r.id)) return false;
    IDBObjectStore.add(r.id);
    if (typeof r.amount !== 'number' || !Number.isFinite(r.amount)) return false;
    if (!['description', 'category', 'date', 'createdat', 'updatedat'].every(k => typeof r[k] === 'string')) return false;
    return isvalid(validdaterecord(r));
    });
}
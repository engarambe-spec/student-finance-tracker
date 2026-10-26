import { validateDescription, validateAmount, validateDate, validateCategory, validateImport } from './validators.js';
import { compileRegex, highlight, matches } from './search.js';

const out = document.getElementById('result');
let pass = 0;
let fail = 0;

function assert(name, cond) {
    const li = document.createElement('li');
    li.textContent = (cond ? 'PASS: ' : 'FAIL: ') + name;
    li.className = cond ? 'pass' : 'fail';
    out.appendChild(li);
    cond ? pass++ : fail++;
}

const valid = { id: 't1', description: 'Bus pass', amount: 45, category: 'Transport', date: '2025-09-20', createdAt: 'x', updatedAt: 'x' };

assert('description valid', validateDescription('Lunch at cafeteria') === '');
assert('description leading space rejected', validateDescription(' Lunch') !== '');
assert('description trailing space rejected', validateDescription('Lunch ') !== '');
assert('description double space rejected', validateDescription('Lunch  at') !== '');
assert('description duplicate word rejected (back-reference)', validateDescription('the the book') !== '');
assert('amount integer valid', validateAmount('45') === '');
assert('amount 2 decimals valid', validateAmount('12.50') === '');
assert('amount zero valid', validateAmount('0') === '');
assert('amount leading zero rejected', validateAmount('012') !== '');
assert('amount 3 decimals rejected', validateAmount('1.234') !== '');
assert('amount negative rejected', validateAmount('-5') !== '');
assert('date valid', validateDate('2025-09-29') === '');
assert('date leap day valid', validateDate('2024-02-29') === '');
assert('date month 13 rejected', validateDate('2025-13-01') !== '');
assert('date wrong format rejected', validateDate('29/09/2025') !== '');
assert('category hyphen valid', validateCategory('self-care') === '');
assert('category digits rejected', validateCategory('food1') !== '');
assert('category trailing hyphen rejected', validateCategory('food-') !== '');
assert('invalid regex returns null', compileRegex('[') === null);
assert('empty regex returns null', compileRegex('') === null);
assert('highlight wraps match', highlight('coffee time', compileRegex('coffee')) === '<mark>coffee</mark> time');
assert('highlight escapes HTML', highlight('<b>', null) === '&lt;b&gt;');
assert('matches cents pattern', matches({ ...valid, amount: 12.75 }, compileRegex('\\.\\d{2}\\b')));
assert('import rejects object', validateImport({}) === false);
assert('import rejects duplicate ids', validateImport([valid, valid]) === false);
assert('import rejects bad amount', validateImport([{ ...valid, amount: '45' }]) === false);
assert('import accepts valid', validateImport([valid]) === true);

document.getElementById('summary').textContent = `${pass} passed, ${fail} failed`;

import { state, addRecord, updateRecord, deleteRecord, money, ymd } from './state.js';
import { validateRecord, isValid } from './validators.js';
import { compileRegex, highlight, matches, esc } from './search.js';
import { $, announce } from './ui.js';

let re = null;
const FIELDS = ['description', 'amount', 'category', 'date'];

function readFields(root) {
  const data = {};
  FIELDS.forEach(f => { data[f] = root.querySelector(`[name="${f}"]`).value; });
  return data;
}

const toRecord = data => ({ ...data, amount: Number(data.amount) });

function sortList(list) {
  const [field, dir] = $('sort').value.split('-');
  const m = dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    if (field === 'amount') return (a.amount - b.amount) * m;
    if (field === 'desc') return a.description.localeCompare(b.description) * m;
    return a.date.localeCompare(b.date) * m;
  });
}

function rowHTML(r) {
  return `<tr data-id="${esc(r.id)}">
    <td data-label="Date">${highlight(r.date, re)}</td>
    <td data-label="Description">${highlight(r.description, re)}</td>
    <td data-label="Category">${highlight(r.category, re)}</td>
    <td data-label="Amount">${esc(money(r.amount))}</td>
    <td data-label="Actions">
      <div class="row-actions">
        <button type="button" data-action="edit" aria-label="Edit ${esc(r.description)}">Edit</button>
        <button type="button" class="danger" data-action="delete" aria-label="Delete ${esc(r.description)}">Delete</button>
      </div>
    </td>
  </tr>`;
}

function editHTML(r) {
  const cell = (name, label, value) =>
    `<td data-label="${label}"><input name="${name}" aria-label="${label}" value="${esc(value)}"></td>`;
  return cell('date', 'Date', r.date) +
    cell('description', 'Description', r.description) +
    cell('category', 'Category', r.category) +
    cell('amount', `Amount (${esc(state.settings.base)})`, String(r.amount)) +
    `<td data-label="Actions"><div class="row-actions">
      <button type="button" data-action="save">Save</button>
      <button type="button" data-action="cancel">Cancel</button>
    </div></td>`;
}

export function renderTable() {
  const list = sortList(state.records.filter(r => matches(r, re)));
  $('tbody').innerHTML = list.map(rowHTML).join('');
  $('empty').hidden = list.length > 0;
  $('result-count').textContent = `${list.length} of ${state.records.length} records shown`;
}

function updateSearch() {
  const v = $('search').value;
  re = compileRegex(v, $('case').checked ? 'i' : '');
  const bad = Boolean(v) && !re;
  $('search-err').textContent = bad ? 'Invalid regex pattern.' : '';
  $('search').setAttribute('aria-invalid', String(bad));
  renderTable();
}

function focusRow(id, action = 'edit') {
  document.querySelector(`tr[data-id="${CSS.escape(id)}"] [data-action="${action}"]`)?.focus();
}

function saveRow(tr) {
  const id = tr.dataset.id;
  const data = readFields(tr);
  const errs = validateRecord(data);
  FIELDS.forEach(f => tr.querySelector(`[name="${f}"]`).setAttribute('aria-invalid', String(Boolean(errs[f]))));
  if (!isValid(errs)) {
    announce(Object.values(errs).filter(Boolean).join(' '));
    tr.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  updateRecord(id, toRecord(data));
  announce('Transaction updated.');
  focusRow(id);
}

function onSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = readFields(form);
  const errs = validateRecord(data);
  FIELDS.forEach(f => {
    $('e-' + f).textContent = errs[f];
    form.querySelector(`[name="${f}"]`).setAttribute('aria-invalid', String(Boolean(errs[f])));
  });
  if (!isValid(errs)) {
    announce('Please fix the highlighted fields.');
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  addRecord(toRecord(data));
  form.reset();
  $('f-date').value = ymd();
  announce('Transaction added.');
}

function onTableClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const tr = btn.closest('tr');
  const id = tr.dataset.id;
  const action = btn.dataset.action;
  if (action === 'edit') {
    tr.innerHTML = editHTML(state.records.find(x => x.id === id));
    tr.querySelector('input').focus();
  }
  if (action === 'cancel') {
    renderTable();
    focusRow(id);
  }
  if (action === 'save') saveRow(tr);
  if (action === 'delete' && confirm('Delete this transaction?')) {
    deleteRecord(id);
    announce('Transaction deleted.');
    $('search').focus();
  }
}

function onTableKey(e) {
  if (e.target.tagName !== 'INPUT') return;
  const tr = e.target.closest('tr');
  const id = tr.dataset.id;
  if (e.key === 'Enter') {
    e.preventDefault();
    saveRow(tr);
  }
  if (e.key === 'Escape') {
    renderTable();
    focusRow(id);
  }
}

export function initRecords() {
  $('f-date').value = ymd();
  $('form').addEventListener('submit', onSubmit);
  $('search').addEventListener('input', updateSearch);
  $('case').addEventListener('change', updateSearch);
  $('sort').addEventListener('change', renderTable);
  $('tbody').addEventListener('click', onTableClick);
  $('tbody').addEventListener('keydown', onTableKey);
  document.addEventListener('state:change', renderTable);
  renderTable();
}
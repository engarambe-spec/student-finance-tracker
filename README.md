# student finace tracker

Live: https://engarambe-spec.github.io/student-finance-tracker/
Demo video : https://youtu.be/aNlOKqUQYZc

## features 
add, edit and delete transactions ' sort' live regex search with highlight 'dashboard stats and 7-day chart ' spending cap alerts ' 3 currencies with manual rates ' locastorage auto-save ' JSON import?export
## Regex Catalog
| Rule | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | `Bus pass` ✓, ` Bus` ✗ |
| Duplicate word (advanced) | `\b(\w+)\s+\1\b` | `the the` ✗ |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `12.50` ✓, `1.234` ✗ |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2024-02-29` ✓ |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Self-Care` ✓ |

Search examples: `(coffee|tea)`, `\.\d{2}\b`, `^2026-10`

## Keyboard
Tab: move · Enter: submit/save · Escape: cancel edit · first Tab: skip link

## Accessibility
Landmarks, labelled inputs, visible focus, ARIA live messages, good contrast, reduced-motion support.

## Tests
Open `tests.html` with Live Server.
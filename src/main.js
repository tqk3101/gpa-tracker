import './style.css';
import { validateCourse, convertScore, calculateGpa } from './validation.js';

const FIELDS = ['name', 'credits', 'score'];
const form = document.getElementById('course-form');
const tbody = document.getElementById('course-rows');
const emptyHint = document.getElementById('empty-hint');
const inputs = Object.fromEntries(FIELDS.map((f) => [f, form.elements[f]]));
const errorEls = Object.fromEntries(FIELDS.map((f) => [f, document.getElementById(`${f}-error`)]));

const stat = Object.fromEntries(
  ["courses", "credits", "passed", "gpa4", "gpa10", "class"].map((k) => [k, document.getElementById(`stat-${k}`)]),
);
const summaryHint = document.getElementById("summary-hint");

const courses = [];
let nextId = 1;

function setError(field, message) {
  errorEls[field].textContent = message ?? '';
  inputs[field].toggleAttribute('aria-invalid', Boolean(message));
}

function renderSummary() {
  const r = calculateGpa(courses);
  const empty = r.totalCourses === 0;
  const fmt2 = (n) => n.toFixed(2).replace(".", ",");
  stat.courses.textContent = empty ? "—" : r.totalCourses;
  stat.credits.textContent = empty ? "—" : r.totalCredits;
  stat.passed.textContent = empty ? "—" : r.passedCredits;
  stat.gpa4.textContent = empty ? "—" : fmt2(r.gpa4);
  stat.gpa10.textContent = empty ? "—" : fmt2(r.gpa10);
  stat.class.textContent = empty ? "—" : r.classification;
  summaryHint.hidden = !empty;
}

function render() {
  renderSummary();
  tbody.replaceChildren(
    ...courses.map((c) => {
      const tr = document.createElement('tr');
      const { letter, point4 } = convertScore(c.score);
      const fmt = (n) => n.toFixed(1).replace('.', ',');
      for (const text of [c.name, c.credits, fmt(c.score), letter, fmt(point4)]) {
        const td = document.createElement('td');
        td.textContent = text;
        tr.append(td);
      }
      return tr;
    }),
  );
  emptyHint.hidden = courses.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateCourse({
    name: inputs.name.value,
    credits: inputs.credits.value,
    score: inputs.score.value,
  });
  for (const f of FIELDS) setError(f, result.errors?.[f]);
  if (!result.ok) {
    inputs[FIELDS.find((f) => result.errors[f])].focus();
    return;
  }
  courses.push({ id: nextId++, ...result.values });
  render();
  form.reset();
  inputs.name.focus();
});

for (const f of FIELDS) inputs[f].addEventListener('input', () => setError(f));

render();

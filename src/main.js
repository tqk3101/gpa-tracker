import './style.css';
import { loadCourses, saveCourses } from "./storage.js";
import { validateCourse, convertScore, calculateGpa, updateCourse, removeCourse } from './validation.js';

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

const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const clearBtn = document.getElementById("clear-btn");
const storageWarning = document.getElementById("storage-warning");

let storage = null;
try {
  storage = window.localStorage;
} catch {
  storage = null;
}
const loaded = storage ? loadCourses(storage) : { courses: [], available: false };

let nextId = 1;
let courses = loaded.courses.map((c) => ({ id: nextId++, ...c }));
let editingId = null;

function showStorageWarning(message) {
  storageWarning.textContent = message ?? "";
  storageWarning.hidden = !message;
}

// Ghi sau mỗi thay đổi (F5b). Thất bại thì giữ thay đổi trên màn hình và báo cho người dùng.
function persist() {
  if (!storage) return;
  showStorageWarning(saveCourses(storage, courses) ? null : "Không lưu được dữ liệu");
}

if (!loaded.available) showStorageWarning("Dữ liệu sẽ không được lưu khi tải lại trang");

function setError(field, message) {
  errorEls[field].textContent = message ?? '';
  inputs[field].toggleAttribute('aria-invalid', Boolean(message));
}

function clearErrors() {
  for (const f of FIELDS) setError(f);
}

function exitEditMode() {
  editingId = null;
  form.reset();
  clearErrors();
  submitBtn.textContent = "Thêm môn";
  cancelBtn.hidden = true;
}

function startEdit(course) {
  editingId = course.id;
  clearErrors();
  inputs.name.value = course.name;
  inputs.credits.value = course.credits;
  inputs.score.value = String(course.score).replace(".", ",");
  submitBtn.textContent = "Lưu";
  cancelBtn.hidden = false;
  render();
  inputs.name.focus();
}

function deleteCourse(course) {
  if (!window.confirm(`Xoá môn "${course.name}"?`)) return;
  if (course.id === editingId) exitEditMode();
  courses = removeCourse(courses, course.id);
  persist();
  render();
}

function actionButton(label, className, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  if (className) b.className = className;
  b.addEventListener("click", onClick);
  return b;
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
      if (c.id === editingId) tr.className = "editing";
      const actions = document.createElement("td");
      actions.append(actionButton("Sửa", "", () => startEdit(c)), actionButton("Xoá", "danger", () => deleteCourse(c)));
      tr.append(actions);
      return tr;
    }),
  );
  emptyHint.hidden = courses.length > 0;
  clearBtn.disabled = courses.length === 0;
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
  if (editingId !== null) {
    courses = updateCourse(courses, editingId, result.values);
    exitEditMode();
  } else {
    courses.push({ id: nextId++, ...result.values });
    form.reset();
  }
  persist();
  render();
  inputs.name.focus();
});

clearBtn.addEventListener("click", () => {
  if (courses.length === 0 || !window.confirm("Xoá toàn bộ môn học?")) return;
  exitEditMode();
  courses = [];
  persist();
  render();
});

cancelBtn.addEventListener("click", () => {
  exitEditMode();
  render();
});

for (const f of FIELDS) inputs[f].addEventListener('input', () => setError(f));

render();

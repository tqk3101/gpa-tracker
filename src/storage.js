import { validateCourse } from './validation.js';

export const STORAGE_KEY = 'gpa-tracker:v1';

// Chỉ lưu tên, tín chỉ, điểm hệ 10 (EC-39). Mã môn (id) được cấp lại khi tải.
export function serializeCourses(courses) {
  return JSON.stringify(courses.map(({ name, credits, score }) => ({ name, credits, score })));
}

// Đọc chuỗi đã lưu: hỏng hẳn hoặc không phải danh sách → []; hỏng một phần → giữ môn hợp lệ, bỏ môn hỏng.
export function parseCourses(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const courses = [];
  for (const item of data) {
    if (item === null || typeof item !== 'object') continue;
    if (typeof item.name !== 'string' || typeof item.credits !== 'number' || typeof item.score !== 'number') continue;
    const r = validateCourse(item);
    if (r.ok) courses.push(r.values);
  }
  return courses;
}

// Trả về { courses, available }. available=false khi trình duyệt không cho dùng localStorage (EC-40).
export function loadCourses(storage) {
  try {
    const text = storage.getItem(STORAGE_KEY);
    return { courses: text === null ? [] : parseCourses(text), available: true };
  } catch {
    return { courses: [], available: false };
  }
}

// Trả về true nếu ghi thành công (EC-41).
export function saveCourses(storage, courses) {
  try {
    storage.setItem(STORAGE_KEY, serializeCourses(courses));
    return true;
  } catch {
    return false;
  }
}

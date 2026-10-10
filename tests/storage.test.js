import { describe, it, expect } from 'vitest';
import { STORAGE_KEY, serializeCourses, parseCourses, loadCourses, saveCourses } from '../src/storage.js';

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v; } };
};
const good = { name: 'Toán', credits: 3, score: 8.5 };

describe('lưu dữ liệu (F5)', () => {
  it('key đúng theo PRD', () => expect(STORAGE_KEY).toBe('gpa-tracker:v1'));

  it('chỉ lưu tên, tín chỉ, điểm hệ 10 (EC-39)', () => {
    const text = serializeCourses([{ id: 7, ...good, letter: 'A' }]);
    expect(JSON.parse(text)).toEqual([good]);
  });
  it('ghi rồi đọc lại ra đúng dữ liệu, đúng thứ tự (EC-36)', () => {
    const s = fakeStorage();
    const list = [good, { name: 'Lý', credits: 2, score: 5 }];
    expect(saveCourses(s, list)).toBe(true);
    expect(loadCourses(s)).toEqual({ courses: list, available: true });
  });
  it('chưa có dữ liệu → danh sách rỗng (EC-35)', () => {
    expect(loadCourses(fakeStorage())).toEqual({ courses: [], available: true });
  });
});

describe('dữ liệu hỏng (EC-37, EC-38)', () => {
  it.each(['{không phải json', '', 'null', '123', '"abc"', '{"a":1}'])('%j → rỗng', (text) => {
    expect(parseCourses(text)).toEqual([]);
  });
  it('giữ môn hợp lệ, bỏ môn hỏng', () => {
    const bad = [
      { name: '', credits: 3, score: 8 },
      { name: 'X', credits: 0, score: 8 },
      { name: 'X', credits: 3, score: 15 },
      { name: 'X', credits: 3.5, score: 8 },
      { name: 'X', credits: '3', score: 8 },
      { name: 5, credits: 3, score: 8 },
      { credits: 3, score: 8 },
      null, 'abc', 42, [],
    ];
    expect(parseCourses(JSON.stringify([bad[0], good, ...bad.slice(1)]))).toEqual([good]);
  });
  it('chuẩn hoá lại khi đọc: cắt khoảng trắng, làm tròn điểm', () => {
    expect(parseCourses(JSON.stringify([{ name: '  Hoá ', credits: 2, score: 7.04 }]))).toEqual([
      { name: 'Hoá', credits: 2, score: 7 },
    ]);
  });
  it('trường thừa trong dữ liệu bị bỏ qua (EC-39)', () => {
    expect(parseCourses(JSON.stringify([{ ...good, letter: 'F', point4: 0 }]))).toEqual([good]);
  });
});

describe('bộ nhớ lỗi (EC-40, EC-41)', () => {
  it('không đọc được localStorage → rỗng, available=false', () => {
    const s = { getItem: () => { throw new Error('blocked'); } };
    expect(loadCourses(s)).toEqual({ courses: [], available: false });
  });
  it('ghi thất bại → trả về false, không ném lỗi', () => {
    const s = { setItem: () => { throw new Error('quota'); } };
    expect(saveCourses(s, [good])).toBe(false);
  });
});

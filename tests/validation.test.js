import { describe, it, expect } from 'vitest';
import { validateName, validateCredits, validateScore, validateCourse } from '../src/validation.js';

describe('tên môn (EC-01→04)', () => {
  it('EC-01 chỉ dấu cách → lỗi', () => {
    expect(validateName('   ').error).toBe('Vui lòng nhập tên môn');
    expect(validateName('').error).toBe('Vui lòng nhập tên môn');
  });
  it('EC-02 bỏ khoảng trắng 2 đầu', () => expect(validateName('  Toán  ').value).toBe('Toán'));
  it('EC-03 ranh giới 100/101 ký tự, chữ có dấu tính 1 ký tự', () => {
    expect(validateName('ệ'.repeat(100)).value).toHaveLength(100);
    expect(validateName('a'.repeat(101)).error).toBe('Tên môn tối đa 100 ký tự');
    expect(validateName('ệ'.repeat(100)).error).toBeUndefined(); // ệ dạng tổ hợp
  });
  it('EC-04 giữ nguyên ký tự đặc biệt', () =>
    expect(validateName('<b>Toán</b>').value).toBe('<b>Toán</b>'));
});

describe('số tín chỉ (EC-06→10)', () => {
  it('EC-06 để trống', () => expect(validateCredits('').error).toBe('Vui lòng nhập số tín chỉ'));
  it.each(['0', '11', '-1'])('EC-07 ngoài khoảng: %s', (v) =>
    expect(validateCredits(v).error).toBe('Số tín chỉ phải từ 1 đến 10'));
  it.each(['2.5', '2,5', 'ba', '3a', '1e1'])('EC-08/09 không nguyên: %s', (v) =>
    expect(validateCredits(v).error).toBe('Số tín chỉ phải là số nguyên'));
  it.each([['03', 3], [' 3 ', 3], ['1', 1], ['10', 10]])('EC-10 hợp lệ: %s', (v, n) =>
    expect(validateCredits(v).value).toBe(n));
});

describe('điểm hệ 10 (EC-11→17)', () => {
  it('EC-11 để trống', () => expect(validateScore('').error).toBe('Vui lòng nhập điểm'));
  it('EC-12 dấu phẩy và dấu chấm', () => {
    expect(validateScore('8,5').value).toBe(8.5);
    expect(validateScore('8.5').value).toBe(8.5);
  });
  it.each(['-1', '10.5', '10.01'])('EC-13 ngoài khoảng: %s', (v) =>
    expect(validateScore(v).error).toBe('Điểm phải từ 0 đến 10'));
  it.each(['abc', '8..5', '8,5,1', '8.', ',5', '1e1'])('EC-14 sai định dạng: %s', (v) =>
    expect(validateScore(v).error).toBe('Điểm không hợp lệ, ví dụ: 8,5'));
  it('EC-15 làm tròn 1 lần', () => expect(validateScore('8.449').value).toBe(8.4));
  it.each([['8.45', 8.5], ['7.95', 8], ['3.95', 4], ['3.94', 3.9], ['6.55', 6.6], ['0.05', 0.1]])(
    'EC-16 sát ranh giới: %s → %s',
    (v, n) => expect(validateScore(v).value).toBe(n),
  );
  it('EC-17 điểm biên', () => {
    expect(validateScore('0').value).toBe(0);
    expect(validateScore('10').value).toBe(10);
    expect(validateScore('9.96').value).toBe(10);
  });
});

describe('validateCourse (EC-18)', () => {
  it('hợp lệ trả về giá trị đã chuẩn hoá', () => {
    expect(validateCourse({ name: ' Toán ', credits: '3', score: '8,45' })).toEqual({
      ok: true,
      values: { name: 'Toán', credits: 3, score: 8.5 },
    });
  });
  it('nhiều ô sai báo hết cùng lúc', () => {
    const r = validateCourse({ name: '', credits: '0', score: 'x' });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors)).toEqual(['name', 'credits', 'score']);
  });
});

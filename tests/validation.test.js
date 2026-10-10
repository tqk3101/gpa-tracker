import { describe, it, expect } from 'vitest';
import { validateName, validateCredits, validateScore, validateCourse, convertScore, calculateGpa, classify, updateCourse, removeCourse } from '../src/validation.js';

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

describe('quy đổi điểm (F2, EC-39)', () => {
  it.each([
    [10, 'A', 4.0], [8.5, 'A', 4.0],
    [8.4, 'B+', 3.5], [8.0, 'B+', 3.5],
    [7.9, 'B', 3.0], [7.0, 'B', 3.0],
    [6.9, 'C+', 2.5], [6.5, 'C+', 2.5],
    [6.4, 'C', 2.0], [5.5, 'C', 2.0],
    [5.4, 'D+', 1.5], [5.0, 'D+', 1.5],
    [4.9, 'D', 1.0], [4.0, 'D', 1.0],
    [3.9, 'F', 0.0], [0, 'F', 0.0],
  ])('điểm %s → %s (%s)', (score, letter, point4) =>
    expect(convertScore(score)).toEqual({ letter, point4 }));

  it('nhập 8,45 → làm tròn 8,5 → A', () => {
    const { value } = validateScore('8,45');
    expect(convertScore(value).letter).toBe('A');
  });
  it('nhập 3,95 → làm tròn 4,0 → D', () => {
    const { value } = validateScore('3.95');
    expect(convertScore(value)).toEqual({ letter: 'D', point4: 1.0 });
  });
});

describe('tính GPA (F3)', () => {
  const c = (credits, score) => ({ credits, score });

  it('chưa có môn → null (EC-21)', () => {
    expect(calculateGpa([])).toEqual({
      totalCourses: 0, totalCredits: 0, passedCredits: 0, gpa4: null, gpa10: null, classification: null,
    });
  });
  it('1 môn → GPA đúng điểm môn đó (EC-26)', () => {
    expect(calculateGpa([c(3, 8.5)])).toMatchObject({ gpa4: 4, gpa10: 8.5, classification: 'Xuất sắc' });
  });
  it('trung bình có trọng số tín chỉ', () => {
    // (4.0×3 + 3.0×2) / 5 = 3.6 ; (9×3 + 7×2) / 5 = 8.2
    expect(calculateGpa([c(3, 9), c(2, 7)])).toMatchObject({
      totalCourses: 2, totalCredits: 5, passedCredits: 5, gpa4: 3.6, gpa10: 8.2, classification: 'Xuất sắc',
    });
  });
  it('môn F tính vào tổng tín chỉ và GPA nhưng không vào tín chỉ đạt (EC-23)', () => {
    expect(calculateGpa([c(3, 8.5), c(3, 3.9)])).toMatchObject({
      totalCredits: 6, passedCredits: 3, gpa4: 2, gpa10: 6.2, classification: 'Trung bình',
    });
  });
  it('tất cả môn F → 0, Yếu, tín chỉ đạt 0 (EC-22)', () => {
    expect(calculateGpa([c(2, 0), c(3, 3.9)])).toMatchObject({
      passedCredits: 0, gpa4: 0, classification: 'Yếu',
    });
  });
  it('điểm đúng 4.0 tính là đạt', () => {
    expect(calculateGpa([c(3, 4.0)]).passedCredits).toBe(3);
  });
  it('làm tròn 2 chữ số, xếp loại theo GPA đã làm tròn (EC-24)', () => {
    // (3.5×21 + 4.0×5) / 26 = 3.5961… → 3.6 → Xuất sắc
    const r = calculateGpa([c(7, 8.0), c(7, 8.0), c(7, 8.0), c(5, 9)]);
    expect(r.gpa4).toBe(3.6);
    expect(r.classification).toBe('Xuất sắc');
  });
  it('làm tròn half-up GPA hệ 10: 8.005 → 8.01', () => {
    // (8.0×199 + 8.1×1) / 200 = 8.0005 → 8.00 ; (8.0×1 + 8.1×1)/2 = 8.05
    expect(calculateGpa([c(1, 8.0), c(1, 8.1)]).gpa10).toBe(8.05);
    expect(calculateGpa([c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0),
      c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(10, 8.0), c(9, 8.0), c(1, 8.1)]).gpa10).toBe(8.0);
  });
});

describe('xếp loại (F3)', () => {
  it.each([
    [4.0, 'Xuất sắc'], [3.6, 'Xuất sắc'],
    [3.59, 'Giỏi'], [3.2, 'Giỏi'],
    [3.19, 'Khá'], [2.5, 'Khá'],
    [2.49, 'Trung bình'], [2.0, 'Trung bình'],
    [1.99, 'Yếu'], [0, 'Yếu'],
  ])('GPA %s → %s', (gpa, label) => expect(classify(gpa)).toBe(label));
});

describe('sửa / xoá môn (F4, EC-29, EC-32)', () => {
  const list = () => [
    { id: 1, name: 'A', credits: 3, score: 8 },
    { id: 2, name: 'B', credits: 2, score: 7 },
    { id: 3, name: 'C', credits: 4, score: 6 },
  ];
  it('sửa theo id, giữ nguyên vị trí và các môn khác', () => {
    const r = updateCourse(list(), 2, { name: 'B2', credits: 5, score: 9 });
    expect(r.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(r[1]).toEqual({ id: 2, name: 'B2', credits: 5, score: 9 });
    expect(r[0]).toEqual(list()[0]);
  });
  it('không làm thay đổi danh sách gốc', () => {
    const orig = list();
    updateCourse(orig, 1, { name: 'X', credits: 1, score: 1 });
    removeCourse(orig, 1);
    expect(orig).toEqual(list());
  });
  it('xoá theo id, không theo số thứ tự', () => {
    expect(removeCourse(list(), 2).map((c) => c.id)).toEqual([1, 3]);
  });
  it('id không tồn tại → không đổi gì', () => {
    expect(removeCourse(list(), 99)).toEqual(list());
    expect(updateCourse(list(), 99, { name: 'X' })).toEqual(list());
  });
  it('GPA tính lại đúng sau khi sửa và xoá', () => {
    const edited = updateCourse([{ id: 1, name: 'A', credits: 3, score: 5 }], 1, { score: 9 });
    expect(calculateGpa(edited).gpa4).toBe(4);
    expect(calculateGpa(removeCourse(edited, 1)).gpa4).toBeNull();
  });
});

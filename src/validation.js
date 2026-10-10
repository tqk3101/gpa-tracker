export const NAME_MAX = 100;

export function validateName(raw) {
  const value = String(raw ?? '').trim().normalize('NFC');
  if (value === '') return { error: 'Vui lòng nhập tên môn' };
  if ([...value].length > NAME_MAX) return { error: `Tên môn tối đa ${NAME_MAX} ký tự` };
  return { value };
}

export function validateCredits(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return { error: 'Vui lòng nhập số tín chỉ' };
  if (!/^-?\d+$/.test(text)) return { error: 'Số tín chỉ phải là số nguyên' };
  const value = Number(text);
  if (value < 1 || value > 10) return { error: 'Số tín chỉ phải từ 1 đến 10' };
  return { value };
}

// Làm tròn half-up 1 chữ số bằng chuỗi thập phân, tránh sai số số thực (vd 7.95, 3.95).
function roundOneDecimal(text) {
  const [intPart, fracPart = ''] = text.split('.');
  const frac = fracPart.padEnd(2, '0');
  let tenths = Number(intPart) * 10 + Number(frac[0]);
  if (Number(frac[1]) >= 5) tenths += 1;
  return tenths / 10;
}

export function validateScore(raw) {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (text === '') return { error: 'Vui lòng nhập điểm' };
  if (!/^-?\d+(\.\d+)?$/.test(text)) return { error: 'Điểm không hợp lệ, ví dụ: 8,5' };
  const num = Number(text);
  if (num < 0 || num > 10) return { error: 'Điểm phải từ 0 đến 10' };
  return { value: roundOneDecimal(text) };
}

// Kiểm tra cả 3 ô cùng lúc. Trả về { ok, values } hoặc { ok: false, errors } theo khoá name/credits/score.
export function validateCourse({ name, credits, score }) {
  const results = {
    name: validateName(name),
    credits: validateCredits(credits),
    score: validateScore(score),
  };
  const errors = {};
  for (const [key, r] of Object.entries(results)) if (r.error) errors[key] = r.error;
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    values: { name: results.name.value, credits: results.credits.value, score: results.score.value },
  };
}

// Bảng quy đổi PRD §F2, xếp từ cao xuống thấp. Điểm đầu vào đã làm tròn 1 chữ số.
const GRADE_BANDS = [
  { min: 8.5, letter: 'A', point4: 4.0 },
  { min: 8.0, letter: 'B+', point4: 3.5 },
  { min: 7.0, letter: 'B', point4: 3.0 },
  { min: 6.5, letter: 'C+', point4: 2.5 },
  { min: 5.5, letter: 'C', point4: 2.0 },
  { min: 5.0, letter: 'D+', point4: 1.5 },
  { min: 4.0, letter: 'D', point4: 1.0 },
];

export function convertScore(score10) {
  const band = GRADE_BANDS.find((b) => score10 >= b.min);
  return band ? { letter: band.letter, point4: band.point4 } : { letter: 'F', point4: 0.0 };
}

// a/b làm tròn half-up đến 2 chữ số thập phân, dùng số nguyên để tránh sai số số thực.
function divideRound2(num, den) {
  return Math.floor((200 * num + den) / (2 * den)) / 100;
}

export function classify(gpa4) {
  if (gpa4 >= 3.6) return 'Xuất sắc';
  if (gpa4 >= 3.2) return 'Giỏi';
  if (gpa4 >= 2.5) return 'Khá';
  if (gpa4 >= 2.0) return 'Trung bình';
  return 'Yếu';
}

// PRD §F3. Danh sách rỗng trả về null cho GPA và xếp loại (giao diện hiển thị "—").
// Điểm hệ 10 có 1 chữ số thập phân nên nhân 10 để tính trên số nguyên; điểm hệ 4 là bội của 0.5.
export function calculateGpa(courses) {
  const totalCourses = courses.length;
  if (totalCourses === 0) {
    return { totalCourses: 0, totalCredits: 0, passedCredits: 0, gpa4: null, gpa10: null, classification: null };
  }
  let totalCredits = 0;
  let passedCredits = 0;
  let sum4 = 0;
  let sum10 = 0;
  for (const { credits, score } of courses) {
    totalCredits += credits;
    if (score >= 4.0) passedCredits += credits;
    sum4 += Math.round(convertScore(score).point4 * 2) * credits;
    sum10 += Math.round(score * 10) * credits;
  }
  const gpa4 = divideRound2(sum4, 2 * totalCredits);
  const gpa10 = divideRound2(sum10, 10 * totalCredits);
  return { totalCourses, totalCredits, passedCredits, gpa4, gpa10, classification: classify(gpa4) };
}

// Sửa/xoá theo mã riêng (id), không theo vị trí dòng. Trả về danh sách mới, giữ nguyên thứ tự.
export function updateCourse(courses, id, values) {
  return courses.map((c) => (c.id === id ? { ...c, ...values } : c));
}

export function removeCourse(courses, id) {
  return courses.filter((c) => c.id !== id);
}

# Kế hoạch dự án – GPA Tracker (mô hình Waterfall)

Mỗi giai đoạn chỉ bắt đầu khi giai đoạn trước đã được PM duyệt. Nếu phải quay lại sửa giai đoạn trước, ghi lý do vào `STATUS.md`.

## Giai đoạn 1 – Yêu cầu
- **Đầu vào:** ý tưởng sản phẩm
- **Công việc:** viết PRD (chức năng F1–F5, quy tắc kiểm tra dữ liệu, bảng quy đổi điểm, yêu cầu phi chức năng)
- **Kết quả:** `PRD.md`
- **Điều kiện xong:** PM duyệt PRD

## Giai đoạn 2 – Thiết kế luồng nghiệp vụ
- **Đầu vào:** `PRD.md`
- **Công việc:** vẽ flowchart (Mermaid) cho từng chức năng F1–F5, liệt kê các điểm PRD chưa nói rõ kèm đề xuất xử lý
- **Kết quả:** `docs/flowcharts.md`
- **Điều kiện xong:** PM duyệt flowchart và chốt các điểm còn mở

## Giai đoạn 3 – Lập trình và kiểm thử tự động
- **Đầu vào:** flowchart đã duyệt
- **Công việc** (theo thứ tự phụ thuộc trong PRD §4):
  1. Dựng khung dự án: Vite, Vitest
  2. F1 Thêm môn → F2 Quy đổi điểm → F3 Tính GPA → F4 Sửa/xoá → F5 Lưu dữ liệu
  3. Viết test tự động cho phần tính toán (kiểm tra dữ liệu, quy đổi, GPA, đọc/ghi dữ liệu)
  4. Tự chạy toàn bộ test và sửa đến khi đạt hết
- **Kết quả:** mã nguồn, bộ test tự động, báo cáo kết quả chạy test
- **Điều kiện xong:** 100% test đạt, PM duyệt

## Giai đoạn 4 – Kiểm thử giao diện (E2E, PM tự test)
- **Đầu vào:** bản chạy được trên máy
- **Công việc:** soạn bảng test case (bước làm, dữ liệu, kết quả mong đợi); PM test trên giao diện và ghi kết quả; sửa các lỗi phát hiện được
- **Kết quả:** `docs/test-cases.md` đã điền kết quả
- **Điều kiện xong:** mọi test case đạt hoặc lỗi còn lại đã được PM chấp nhận

## Giai đoạn 5 – Triển khai
- **Công việc:** đưa lên Vercel, kiểm tra nhanh trên URL công khai (cả máy tính và điện thoại)
- **Kết quả:** URL công khai
- **Điều kiện xong:** PM xác nhận bản chạy thật hoạt động đúng

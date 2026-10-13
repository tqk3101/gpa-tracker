# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-13_

## Trạng thái hiện tại

| Giai đoạn | Trạng thái |
|-----------|-----------|
| 1. Yêu cầu (PRD) | Xong |
| 2. Thiết kế luồng nghiệp vụ | Xong (44 tình huống đặc biệt); 7 điểm còn mở bên dưới chưa được PM chốt chính thức |
| 3. Lập trình và test tự động | Xong (F1–F5, 99 test đạt; bản vá so khớp tên trùng đang chờ commit) |
| 4. Kiểm thử giao diện (E2E) | **Đang làm**: đã viết 88 test case ở `docs/test-cases.md`, chờ PM test và điền kết quả |
| 5. Triển khai Vercel | Chưa bắt đầu |

| Chức năng | Trạng thái |
|-----------|-----------|
| F1 Thêm môn học | Xong, đã merge vào `main` |
| F2 Quy đổi điểm | Xong, đã merge vào `main` |
| F3 Tính GPA | Xong, đã merge vào `main` |
| F4 Sửa/xoá môn | Xong, đã merge vào `main` |
| F5 Lưu dữ liệu | Xong, đã merge vào `main` |

**Việc tiếp theo:** PM test theo `docs/test-cases.md`, điền cột "Kết quả thực tế"; có lỗi thì báo để sửa. Xong thì sang giai đoạn 5 (Vercel).

## Quyết định đã chốt

| Ngày | Quyết định | Người quyết |
|------|-----------|-------------|
| 2026-10-07 | Làm theo mô hình Waterfall; mỗi giai đoạn cần PM duyệt mới làm tiếp | PM |
| 2026-10-07 | Flowchart dùng cú pháp Mermaid mới nhất | PM |
| 2026-10-07 | Chốt PRD, chuyển sang Thiết kế; thiết kế phải xét edge cases | PM |
| 2026-10-07 | Kiểm thử gồm test tự động (Vitest) và test giao diện thủ công theo bảng test case | PM |
| 2026-10-10 | Điểm mở #1 (xoá môn đang sửa → xoá trắng form) và #2 (thêm nút "Huỷ") đồng ý theo đề xuất, áp dụng trong F4 | PM |
| 2026-10-10 | Điểm mở #3, #6, #7 đồng ý theo đề xuất, áp dụng trong F5 | PM |
| 2026-10-12 | Điểm mở #5: KHÔNG cho trùng tên môn (không phân biệt hoa/thường), báo "Môn học này đã tồn tại" dưới ô tên; chữ đầu tên môn tự viết hoa; môn giống nhau thì thêm số (Toán, Toán 2). Đã áp dụng vào code, PRD, flowchart, test case | PM |
| 2026-10-10 | Chuyển sang Lập trình, làm F2 (điểm #4: làm tròn 8.45 → 8.5 rồi mới quy đổi, đã áp dụng trong F2) | PM |

## Điểm còn mở (chờ PM chốt)

| # | Tình huống | Đề xuất |
|---|-----------|---------|
| 4 | Nhập điểm dạng 8.45 | Làm tròn thành 8.5 rồi mới quy đổi, nên ra điểm A (đã áp dụng ở F1/F2) |

## Thay đổi so với PRD ban đầu

Đã thêm nút "Huỷ" khi đang sửa môn (điểm mở #2, PM đã đồng ý). PRD §F4 chưa ghi nút này.

Đã thêm quy tắc không trùng tên môn vào PRD §F1 (điểm mở #5, PM chốt 2026-10-12).

Ngày 2026-10-13: vá lỗi so khớp tên môn trùng khi tên có dấu tiếng Việt mã hoá khác kiểu (chuẩn hoá Unicode trước khi so sánh), thêm 1 test; tổng 99 test đạt. Chưa commit.

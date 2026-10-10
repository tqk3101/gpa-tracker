# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-10_

## Trạng thái hiện tại

| Giai đoạn | Trạng thái |
|-----------|-----------|
| 1. Yêu cầu (PRD) | Xong |
| 2. Thiết kế luồng nghiệp vụ | Xong (44 tình huống đặc biệt); 7 điểm còn mở bên dưới chưa được PM chốt chính thức |
| 3. Lập trình và test tự động | **Đang làm**: F1, F2, F3 xong; còn F4, F5 |
| 4. Kiểm thử giao diện (E2E) | Chưa bắt đầu |
| 5. Triển khai Vercel | Chưa bắt đầu |

| Chức năng | Trạng thái |
|-----------|-----------|
| F1 Thêm môn học | Xong, đã merge vào `main` |
| F2 Quy đổi điểm | Xong, đã merge vào `main` |
| F3 Tính GPA | Xong code + test (74 test đạt), nằm ở nhánh `feature/f3-calculate-gpa`, chờ PM xem giao diện |
| F4 Sửa/xoá môn | Chưa làm |
| F5 Lưu dữ liệu | Chưa làm |

**Việc tiếp theo:** PM xem F3 trên giao diện (`npm run dev`), duyệt rồi merge; sau đó làm F4. Nên chốt các điểm còn mở trước khi làm F4 và F5.

## Quyết định đã chốt

| Ngày | Quyết định | Người quyết |
|------|-----------|-------------|
| 2026-10-07 | Làm theo mô hình Waterfall; mỗi giai đoạn cần PM duyệt mới làm tiếp | PM |
| 2026-10-07 | Flowchart dùng cú pháp Mermaid mới nhất | PM |
| 2026-10-07 | Chốt PRD, chuyển sang Thiết kế; thiết kế phải xét edge cases | PM |
| 2026-10-07 | Kiểm thử gồm test tự động (Vitest) và test giao diện thủ công theo bảng test case | PM |
| 2026-10-10 | Chuyển sang Lập trình, làm F2 (điểm #4: làm tròn 8.45 → 8.5 rồi mới quy đổi, đã áp dụng trong F2) | PM |

## Điểm còn mở (chờ PM chốt)

| # | Tình huống | Đề xuất |
|---|-----------|---------|
| 1 | Xoá đúng môn đang được sửa trên form | Xoá trắng form, nút trở lại "Thêm môn" |
| 2 | Đang sửa mà muốn bỏ, không sửa nữa | Thêm nút "Huỷ" (PRD chưa có) |
| 3 | Bấm "Xoá tất cả" khi danh sách đang rỗng | Làm mờ nút, không bấm được |
| 4 | Nhập điểm dạng 8.45 | Làm tròn thành 8.5 rồi mới quy đổi, nên ra điểm A (đã áp dụng ở F1/F2) |
| 5 | Trùng tên môn (học lại) | Cho phép trùng, tính cả hai vào GPA |
| 6 | Dữ liệu lưu hỏng một phần | Giữ môn hợp lệ, bỏ môn hỏng |
| 7 | Mở 2 tab cùng lúc | Chấp nhận tab lưu sau ghi đè, không đồng bộ |

## Thay đổi so với PRD ban đầu

Chưa có thay đổi nào. Nếu PM chốt điểm #2 (nút "Huỷ") thì đó sẽ là phần bổ sung so với PRD.

# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## Trạng thái hiện tại

| Giai đoạn | Trạng thái |
|-----------|-----------|
| 1. Yêu cầu (PRD) | Xong |
| 2. Thiết kế luồng nghiệp vụ | Đã bổ sung edge cases (44 tình huống), **chờ PM duyệt** |
| 3. Lập trình và test tự động | Chưa bắt đầu |
| 4. Kiểm thử giao diện (E2E) | Chưa bắt đầu |
| 5. Triển khai Vercel | Chưa bắt đầu |

**Việc tiếp theo:** PM xem `docs/flowcharts.md` (phần Edge cases) và chốt 7 điểm còn mở bên dưới.

## Quyết định đã chốt

| Ngày | Quyết định | Người quyết |
|------|-----------|-------------|
| 2026-10-07 | Làm theo mô hình Waterfall; mỗi giai đoạn cần PM duyệt mới làm tiếp | PM |
| 2026-10-07 | Flowchart dùng cú pháp Mermaid mới nhất | PM |
| 2026-10-07 | Chốt PRD, chuyển sang Thiết kế; thiết kế phải xét edge cases | PM |
| 2026-10-07 | Kiểm thử gồm test tự động (Vitest) và test giao diện thủ công theo bảng test case | PM |

## Điểm còn mở (chờ PM chốt)

| # | Tình huống | Đề xuất |
|---|-----------|---------|
| 1 | Xoá đúng môn đang được sửa trên form | Xoá trắng form, nút trở lại "Thêm môn" |
| 2 | Đang sửa mà muốn bỏ, không sửa nữa | Thêm nút "Huỷ" (PRD chưa có) |
| 3 | Bấm "Xoá tất cả" khi danh sách đang rỗng | Làm mờ nút, không bấm được |
| 4 | Nhập điểm dạng 8.45 | Làm tròn thành 8.5 rồi mới quy đổi, nên ra điểm A |
| 5 | Trùng tên môn (học lại) | Cho phép trùng, tính cả hai vào GPA |
| 6 | Dữ liệu lưu hỏng một phần | Giữ môn hợp lệ, bỏ môn hỏng |
| 7 | Mở 2 tab cùng lúc | Chấp nhận tab lưu sau ghi đè, không đồng bộ |

## Thay đổi so với PRD ban đầu

Chưa có thay đổi nào. Nếu PM chốt điểm #2 (nút "Huỷ") thì đó sẽ là phần bổ sung so với PRD.

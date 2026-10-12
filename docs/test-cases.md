# Test case E2E (kiểm thử thủ công) – GPA Tracker

Giai đoạn 3: PM kiểm thử trên giao diện. Cột "Kết quả thực tế" để trống, PM điền **Đạt** / **Không đạt** (kèm ghi chú nếu có) khi test.

## Chuẩn bị

- Chạy `npm run dev`, mở địa chỉ hiện ra (thường là http://localhost:5173/) bằng Chrome.
- Trước mỗi nhóm test nên bấm "Xoá tất cả" (hoặc mở tab ẩn danh) để bắt đầu từ danh sách rỗng.
- Cách hiển thị số: dùng **dấu phẩy** (ví dụ `8,5`, `3,60`).
- Cột "Mã EC" liên kết với tình huống đặc biệt trong `docs/flowcharts.md`.

## 1. F1 – Thêm môn học

| ID | Chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|---------|------------------|-----------------|
| TC-01 | Thêm môn hợp lệ | Nhập 3 ô, nhấn "Thêm môn" | Tên `Toán cao cấp`, TC `3`, điểm `8,5` | Môn xuất hiện cuối bảng: Toán cao cấp / 3 / 8,5 / A / 4,0. Form xoá trắng, con trỏ ở ô Tên môn | |
| TC-02 | Thêm bằng phím Enter | Nhập 3 ô hợp lệ, nhấn Enter trong ô Điểm | Tên `Lý`, TC `2`, điểm `7` | Môn được thêm như TC-01 | |
| TC-03 | Thêm nhiều môn | Thêm lần lượt 3 môn | `Toán`/3/8,5; `Lý`/2/7; `Hoá`/4/6 | Cả 3 môn nằm theo đúng thứ tự thêm, môn mới ở cuối (EC-32) | |
| TC-04 | Tên trống (EC-01) | Để trống Tên, nhập 2 ô còn lại hợp lệ, nhấn "Thêm môn" | Tên rỗng | Lỗi "Vui lòng nhập tên môn" ngay dưới ô Tên; không thêm môn | |
| TC-05 | Tên toàn dấu cách (EC-01) | Nhập Tên chỉ gồm vài dấu cách | `   ` | Lỗi "Vui lòng nhập tên môn" | |
| TC-06 | Tên có dấu cách thừa (EC-02) | Nhập tên có dấu cách 2 đầu, thêm môn | `  Toán  ` | Môn hiện là `Toán` (không thừa dấu cách) | |
| TC-07 | Tên đúng 100 ký tự (EC-03) | Gõ đúng 100 ký tự `a`, thêm môn | 100 chữ `a` | Hợp lệ, môn được thêm | |
| TC-08 | Tên 101 ký tự (EC-03) | Gõ 101 ký tự `a`, thêm môn | 101 chữ `a` | Lỗi "Tên môn tối đa 100 ký tự"; không thêm môn | |
| TC-09 | Tên chứa mã HTML (EC-04) | Thêm môn với tên là mã HTML | `<b>Toán</b>` và `C++ & Java` | Bảng hiện nguyên văn `<b>Toán</b>` (không in đậm, không chạy mã), `C++ & Java` hiện đúng | |
| TC-10 | Tín chỉ trống (EC-06) | Để trống TC, hai ô còn lại hợp lệ | TC rỗng | Lỗi "Vui lòng nhập số tín chỉ" | |
| TC-11 | Tín chỉ ngoài khoảng (EC-07) | Thử lần lượt từng giá trị | `0`, `11`, `-1` | Mỗi giá trị đều báo "Số tín chỉ phải từ 1 đến 10" | |
| TC-12 | Tín chỉ biên | Thử `1` và `10` | `1`, `10` | Cả hai đều hợp lệ | |
| TC-13 | Tín chỉ là số lẻ (EC-08) | Thử lần lượt | `2.5`, `2,5` | Lỗi "Số tín chỉ phải là số nguyên" | |
| TC-14 | Tín chỉ không phải số (EC-09) | Thử lần lượt | `ba`, `3a`, `1e1` | Lỗi "Số tín chỉ phải là số nguyên" | |
| TC-15 | Tín chỉ có số 0 đầu / dấu cách (EC-10) | Thử lần lượt | `03`, ` 3 ` | Cả hai hiểu là 3, môn được thêm | |
| TC-16 | Điểm trống (EC-11) | Để trống Điểm | Điểm rỗng | Lỗi "Vui lòng nhập điểm" (không tự hiểu là 0) | |
| TC-17 | Điểm dấu phẩy / dấu chấm (EC-12) | Thêm 2 môn | `8,5` và `8.5` | Cả hai cùng hiện `8,5` | |
| TC-18 | Điểm ngoài khoảng (EC-13) | Thử lần lượt | `-1`, `10.5`, `10.01` | Lỗi "Điểm phải từ 0 đến 10" | |
| TC-19 | Điểm sai định dạng (EC-14) | Thử lần lượt | `abc`, `8..5`, `8,5,1`, `8.`, `,5`, `1e1` | Lỗi "Điểm không hợp lệ, ví dụ: 8,5" | |
| TC-20 | Nhiều chữ số lẻ (EC-15) | Thêm môn điểm `8.449` | `8.449` | Điểm hiện `8,4`, xếp B+ (3,5). Không phải 8,5/A | |
| TC-21 | Làm tròn sát ranh giới (EC-16) | Thêm 4 môn | `8.45`, `7.95`, `3.95`, `3.94` | `8,5`→A (4,0); `8,0`→B+ (3,5); `4,0`→D (1,0); `3,9`→F (0,0) | |
| TC-22 | Điểm biên (EC-17) | Thêm 2 môn | `0` và `10` | `0`→F (0,0); `10`→A (4,0) | |
| TC-23 | Nhiều ô sai cùng lúc (EC-18) | Để trống Tên, TC `0`, Điểm `abc`, nhấn "Thêm môn" | như bên | Cả 3 lỗi hiện cùng lúc dưới từng ô; con trỏ nhảy về ô Tên | |
| TC-24 | Lỗi biến mất khi gõ (EC-19) | Gây lỗi ở ô Tên, rồi gõ vào ô Tên | – | Lỗi của ô Tên biến mất ngay khi gõ; lỗi các ô khác giữ nguyên | |
| TC-25 | Nhấn Thêm 2 lần liên tiếp (EC-20) | Nhập hợp lệ, nhấn Enter hai lần nhanh | Tên `Toán`/3/8 | Chỉ có 1 môn; lần nhấn thứ 2 báo lỗi vì form trống, không thêm môn trùng | |
| TC-26 | Trùng tên môn (EC-05) | Thêm `Toán` hai lần; thử thêm `toán `; rồi thêm `Toán 2` | `Toán`/3/5, rồi `Toán`/3/8, `toán `/3/8, `Toán 2`/3/8 | Lần trùng báo lỗi dưới ô tên "Môn học này đã tồn tại" và không thêm; `Toán 2` thêm được. Khi sửa môn `Toán` và giữ nguyên tên thì lưu được | |
| TC-26b | Tự viết hoa chữ đầu | Nhập tên bắt đầu bằng chữ thường, nhấn "Thêm môn" | `toán rời rạc`/3/8 | Môn hiển thị là `Toán rời rạc` (chữ đầu viết hoa) | |

## 2. F2 – Quy đổi điểm

Với mỗi dòng, thêm 1 môn (TC bất kỳ) với điểm tương ứng và đối chiếu cột Điểm chữ / Hệ 4.

| ID | Chức năng | Bước thực hiện | Dữ liệu (điểm hệ 10) | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|----------------------|------------------|-----------------|
| TC-27 | Quy đổi A | Thêm môn | `10` và `8,5` | A, 4,0 | |
| TC-28 | Quy đổi B+ | Thêm môn | `8,4` và `8,0` | B+, 3,5 | |
| TC-29 | Quy đổi B | Thêm môn | `7,9` và `7,0` | B, 3,0 | |
| TC-30 | Quy đổi C+ | Thêm môn | `6,9` và `6,5` | C+, 2,5 | |
| TC-31 | Quy đổi C | Thêm môn | `6,4` và `5,5` | C, 2,0 | |
| TC-32 | Quy đổi D+ | Thêm môn | `5,4` và `5,0` | D+, 1,5 | |
| TC-33 | Quy đổi D | Thêm môn | `4,9` và `4,0` | D, 1,0 | |
| TC-34 | Quy đổi F | Thêm môn | `3,9` và `0` | F, 0,0 | |

## 3. F3 – Tính GPA và xếp loại

Khung "Kết quả học tập" hiện: Tổng số môn, Tổng tín chỉ, Tín chỉ đạt, GPA hệ 4, GPA hệ 10, Xếp loại.

| ID | Chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|---------|------------------|-----------------|
| TC-35 | Chưa có môn (EC-21) | Xoá hết môn (hoặc mở lần đầu) | – | Mọi chỉ số và Xếp loại hiện "—"; có dòng "Hãy thêm môn học đầu tiên" | |
| TC-36 | GPA có trọng số tín chỉ | Thêm 2 môn | `Toán`/3/8,5; `Lý`/2/7,0 | Số môn 2; Tổng TC 5; TC đạt 5; GPA hệ 4 = `3,60`; GPA hệ 10 = `7,90`; Xếp loại Xuất sắc | |
| TC-37 | Chỉ 1 môn (EC-26) | Thêm 1 môn | `Toán`/4/6,0 | GPA hệ 4 = `2,00`; GPA hệ 10 = `6,00`; Trung bình | |
| TC-38 | GPA tròn số hiện 2 chữ số (EC-25) | Thêm 1 môn | `Toán`/3/7,0 | GPA hệ 4 hiện `3,00` (không phải `3`) | |
| TC-39 | Có môn F (EC-23) | Thêm 2 môn | `A`/3/8,5; `B`/3/3,9 | Tổng TC 6; **TC đạt 3**; GPA hệ 4 `2,00`; GPA hệ 10 `6,20`; Trung bình | |
| TC-40 | Tất cả môn F (EC-22) | Thêm 2 môn | `A`/2/0; `B`/3/3,9 | Tổng TC 5; TC đạt 0; GPA hệ 4 `0,00`; Yếu | |
| TC-41 | Điểm 4,0 tính là đạt | Thêm 1 môn | `Toán`/3/4,0 | TC đạt = 3; GPA hệ 4 `1,00` | |
| TC-42 | Xếp loại Xuất sắc | Mỗi lần chỉ 1 môn | điểm `8,5` | GPA hệ 4 `4,00` → Xuất sắc | |
| TC-43 | Xếp loại Giỏi | Mỗi lần chỉ 1 môn | điểm `8,0` | GPA hệ 4 `3,50` → Giỏi | |
| TC-44 | Xếp loại Khá | Mỗi lần chỉ 1 môn | điểm `7,0` | GPA hệ 4 `3,00` → Khá | |
| TC-45 | Xếp loại Trung bình (đúng 2,00) (EC-24) | Mỗi lần chỉ 1 môn | điểm `5,5` | GPA hệ 4 `2,00` → Trung bình | |
| TC-46 | Xếp loại Yếu | Mỗi lần chỉ 1 môn | điểm `5,0` | GPA hệ 4 `1,50` → Yếu | |
| TC-47 | Biên Giỏi/Khá (đúng 3,20) | Thêm 2 môn | `A`/1/8,5; `B`/4/7,0 | GPA hệ 4 `3,20` → Giỏi; GPA hệ 10 `7,30` | |
| TC-48 | Làm tròn rồi mới xếp loại (EC-24) | Thêm 4 môn | `M1`/7/8,0; `M2`/7/8,0; `M3`/7/8,0; `M4`/5/9,0 | GPA hệ 4 thực tế 3,596 → hiện `3,60` → **Xuất sắc**; GPA hệ 10 `8,19` | |
| TC-49 | GPA cập nhật theo thời gian thực | Thêm môn rồi thêm môn thứ 2 | tuỳ ý | Khung kết quả đổi ngay sau mỗi lần thêm, không cần tải lại | |

## 4. F4 – Sửa và xoá môn học

Chuẩn bị: có sẵn 3 môn `Toán`/3/8,5; `Lý`/2/7; `Hoá`/4/6.

| ID | Chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|---------|------------------|-----------------|
| TC-50 | Bắt đầu sửa | Nhấn "Sửa" ở dòng `Lý` | – | Dữ liệu `Lý`/2/7 lên form; dòng được tô vàng; nút đổi thành "Lưu"; hiện nút "Huỷ"; con trỏ ở ô Tên | |
| TC-51 | Lưu sau khi sửa | Sửa điểm thành `9`, nhấn "Lưu" | điểm `9` | Dòng `Lý` đổi điểm 9,0 / A / 4,0, **vẫn ở vị trí thứ 2** (EC-32); form xoá trắng, nút về "Thêm môn", nút "Huỷ" ẩn; GPA cập nhật | |
| TC-52 | Sửa dùng cùng kiểm tra dữ liệu | Nhấn "Sửa", xoá trống Tên, nhấn "Lưu" | Tên rỗng | Báo lỗi "Vui lòng nhập tên môn"; vẫn ở chế độ sửa; môn trong bảng chưa đổi (EC-33) | |
| TC-53 | Sửa thành dữ liệu sai nhiều ô | Nhấn "Sửa", đặt TC `0`, điểm `abc`, nhấn "Lưu" | như bên | Hiện lỗi dưới từng ô sai; môn trong bảng giữ nguyên | |
| TC-54 | Sửa nhưng không đổi gì (EC-30) | Nhấn "Sửa" rồi "Lưu" luôn | – | Lưu thành công, bảng không đổi, form về trạng thái thêm mới | |
| TC-55 | Nút Huỷ khi đang sửa | Nhấn "Sửa", đổi vài ô, nhấn "Huỷ" | – | Form xoá trắng, nút về "Thêm môn", bỏ tô vàng; môn trong bảng không đổi | |
| TC-56 | Sửa sang môn khác (EC-27) | Nhấn "Sửa" `Toán`, gõ thêm vào ô Tên, rồi nhấn "Sửa" `Hoá` | – | Form chuyển sang dữ liệu `Hoá`, bỏ phần gõ dở, không hỏi lại; chỉ dòng `Hoá` được tô vàng | |
| TC-57 | Sửa dấu phẩy điểm | Nhấn "Sửa" môn có điểm `8,5` | – | Ô Điểm hiện `8,5` (dấu phẩy) | |
| TC-58 | Xoá có xác nhận | Nhấn "Xoá" ở dòng `Lý` | – | Hộp hỏi `Xoá môn "Lý"?` | |
| TC-59 | Đồng ý xoá | Ở hộp xác nhận, chọn OK | – | Dòng `Lý` biến mất; GPA tính lại | |
| TC-60 | Huỷ khi xoá (EC-34) | Nhấn "Xoá", ở hộp chọn Huỷ/Cancel | – | Không có gì thay đổi | |
| TC-61 | Xoá môn đang sửa | Nhấn "Sửa" `Toán`, rồi nhấn "Xoá" ở chính dòng `Toán`, đồng ý | – | Môn bị xoá; form xoá trắng; nút về "Thêm môn", ẩn "Huỷ" (EC-28) | |
| TC-62 | Xoá môn khác khi đang sửa (EC-29) | Nhấn "Sửa" `Toán`, rồi xoá `Hoá`, đồng ý; sửa điểm `Toán` thành `10`, "Lưu" | – | Vẫn sửa đúng `Toán` (không nhầm sang dòng khác); `Toán` có điểm 10,0 | |
| TC-63 | Xoá hết từng môn | Xoá lần lượt từng môn | – | Danh sách rỗng; khung kết quả về "—"; hiện "Hãy thêm môn học đầu tiên" | |

## 5. F5 – Lưu dữ liệu

Các bước dùng DevTools: nhấn F12 → tab Console.

| ID | Chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|---------|------------------|-----------------|
| TC-64 | Mở lần đầu (EC-35) | Mở trang ở tab ẩn danh mới | – | Danh sách rỗng, hiện hướng dẫn, không có cảnh báo | |
| TC-65 | Tải lại giữ dữ liệu (EC-36) | Thêm 3 môn, nhấn F5 | `Toán`, `Lý`, `Hoá` | 3 môn còn nguyên, đúng thứ tự, GPA đúng | |
| TC-66 | Lưu sau khi sửa | Sửa một môn, nhấn F5 | – | Dữ liệu đã sửa còn sau khi tải lại | |
| TC-67 | Lưu sau khi xoá | Xoá một môn, nhấn F5 | – | Môn đã xoá không xuất hiện lại | |
| TC-68 | Key lưu trữ | Console: `localStorage.getItem('gpa-tracker:v1')` | – | Trả về chuỗi JSON chỉ chứa `name`, `credits`, `score` của từng môn (không có điểm chữ, hệ 4) | |
| TC-69 | Dữ liệu hỏng hẳn (EC-37) | Console: `localStorage.setItem('gpa-tracker:v1','{hỏng')` rồi F5 | – | Trang hiển thị bình thường, danh sách rỗng, không báo lỗi, không trắng trang | |
| TC-70 | Không phải danh sách (EC-37) | Console: `localStorage.setItem('gpa-tracker:v1','{"a":1}')` rồi F5 | – | Danh sách rỗng, trang bình thường | |
| TC-71 | Hỏng một phần (EC-38) | Console: `localStorage.setItem('gpa-tracker:v1', JSON.stringify([{name:'Toán',credits:3,score:8},{name:'',credits:3,score:8},{name:'X',credits:0,score:8},{name:'Y',credits:3,score:15}]))` rồi F5 | – | Chỉ còn môn `Toán`; 3 môn hỏng bị bỏ; không báo lỗi | |
| TC-72 | Điểm chữ bị sửa tay (EC-39) | Console: `localStorage.setItem('gpa-tracker:v1', JSON.stringify([{name:'Toán',credits:3,score:8.5,letter:'F',point4:0}]))` rồi F5 | – | Hiện `Toán` 8,5 / **A** / 4,0 (tính lại từ điểm hệ 10, bỏ qua dữ liệu sửa tay) | |
| TC-73 | Xoá tất cả khi có môn | Có vài môn, nhấn "Xoá tất cả" | – | Hộp hỏi "Xoá toàn bộ môn học?" | |
| TC-74 | Đồng ý xoá tất cả | Ở hộp xác nhận chọn OK, rồi F5 | – | Danh sách rỗng, khung kết quả "—"; sau khi tải lại vẫn rỗng | |
| TC-75 | Huỷ xoá tất cả | Nhấn "Xoá tất cả", chọn Huỷ | – | Không có gì thay đổi | |
| TC-76 | Nút Xoá tất cả khi rỗng | Xoá hết môn, quan sát nút | – | Nút bị làm mờ, không bấm được | |
| TC-77 | Xoá tất cả khi đang sửa (EC-31) | Nhấn "Sửa" một môn, rồi "Xoá tất cả", đồng ý | – | Danh sách rỗng, form xoá trắng, thoát chế độ sửa (nút "Thêm môn", ẩn "Huỷ") | |
| TC-78 | Ghi thất bại (EC-41) | Console: `Storage.prototype.setItem = () => { throw new Error('full') }` rồi thêm 1 môn | – | Môn vẫn hiện trên màn hình; xuất hiện cảnh báo "Không lưu được dữ liệu" | |
| TC-79 | Trình duyệt chặn bộ nhớ (EC-40) | Chrome → Cài đặt → Quyền riêng tư → chặn toàn bộ cookie và dữ liệu trang web, rồi mở trang | – | Ứng dụng vẫn dùng được; hiện cảnh báo "Dữ liệu sẽ không được lưu khi tải lại trang" | |
| TC-80 | Hai tab cùng lúc (EC-42) | Mở 2 tab; ở tab 1 thêm `A`; ở tab 2 (mở trước) thêm `B`; tải lại tab 1 | – | Tab lưu sau ghi đè tab lưu trước (chỉ còn `B`); không đồng bộ — đây là hành vi đã chấp nhận (điểm mở #7) | |

## 6. Giao diện và phi chức năng

Dùng DevTools (F12) → biểu tượng điện thoại (Toggle device toolbar) để chọn độ rộng màn hình.

| ID | Chức năng | Bước thực hiện | Dữ liệu | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|----------------|---------|------------------|-----------------|
| TC-81 | Hiển thị ở 360px | Đặt độ rộng 360px, thêm vài môn | – | Form, khung kết quả, nút đều đọc và bấm được; trang không bị tràn ngang | |
| TC-82 | Tên dài ở 360px (EC-43) | Ở 360px, thêm môn có tên 100 ký tự `a` liền không dấu cách | 100 chữ `a` | Tên tự xuống dòng trong ô, không làm trang tràn ngang. **Lưu ý:** bảng có 6 cột nên ở màn hình hẹp bảng có thể cuộn ngang trong khung riêng (khác thiết kế gốc "không có thanh cuộn ngang") — PM cho ý kiến | |
| TC-83 | Nút Sửa / Xoá ở màn hình hẹp | Ở 360px, cuộn bảng tới cột Thao tác | – | Nút "Sửa", "Xoá" bấm được | |
| TC-84 | Nhiều môn (EC-44) | Thêm 50+ môn (có thể dán dữ liệu bằng Console cho nhanh) | – | Không giới hạn số môn; trang cuộn dọc bình thường; GPA vẫn đúng | |
| TC-85 | Màn hình rộng | Mở ở độ rộng laptop (≥1280px) | – | Bố cục gọn, nội dung căn giữa, dễ đọc | |
| TC-86 | Toàn bộ tiếng Việt | Xem lại tất cả nhãn, lỗi, hộp xác nhận, cảnh báo | – | Mọi chữ hiển thị cho người dùng đều là tiếng Việt có dấu | |
| TC-87 | Lỗi nằm dưới đúng ô | Gây lỗi ở từng ô | – | Mỗi lỗi hiện ngay dưới ô nhập tương ứng | |
| TC-88 | Tải trang không lỗi | Mở Console khi tải trang và thao tác bình thường | – | Không có thông báo lỗi đỏ trong Console | |

## Tổng kết (PM điền)

| Mục | Số lượng |
|-----|----------|
| Tổng số test case | 88 |
| Đạt | |
| Không đạt | |
| Ngày kiểm thử | |
| Người kiểm thử | |

# Luồng nghiệp vụ – GPA Tracker

Thiết kế từ `PRD.md` (đã chốt ngày 2026-10-07). Ký hiệu dùng trong sơ đồ:

| Hình | Ý nghĩa |
|------|---------|
| Hình viên thuốc | Bắt đầu / Kết thúc |
| Hình bình hành | Người dùng nhập / hệ thống hiển thị |
| Hình chữ nhật | Hệ thống xử lý |
| Hình thoi | Điều kiện rẽ nhánh |
| Hình chữ nhật viền đôi | Gọi sang luồng chức năng khác |
| Hình trụ | Bộ nhớ trình duyệt (localStorage) |

Mã `EC-xx` trong sơ đồ trỏ tới bảng **Edge cases** ở cuối tài liệu. Các mã này sẽ được dùng lại khi viết test tự động và bảng test case.

---

## F1. Thêm môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    IN@{ shape: lean-r, label: "Nhập Tên môn, Số tín chỉ, Điểm hệ 10" }
    BTN@{ shape: lean-r, label: "Nhấn 'Thêm môn' hoặc Enter" }
    NORM@{ shape: rect, label: "Chuẩn hoá:<br/>- Bỏ khoảng trắng 2 đầu cả 3 ô<br/>- Điểm: đổi dấu phẩy thành dấu chấm" }
    CHECK@{ shape: rect, label: "Kiểm tra cả 3 ô cùng lúc:<br/>- Tên: 1–100 ký tự (EC-01→05)<br/>- Tín chỉ: số nguyên 1–10 (EC-06→10)<br/>- Điểm: đúng dạng số, 0–10 (EC-11→14)" }
    ANY@{ shape: diamond, label: "Có ô nào sai?" }
    ERR@{ shape: lean-r, label: "Hiện lỗi tiếng Việt dưới từng ô sai,<br/>đưa con trỏ về ô sai đầu tiên (EC-18)" }
    ROUND@{ shape: rect, label: "Làm tròn điểm 1 chữ số thập phân<br/>(làm tròn 1 lần duy nhất – EC-15, EC-16)" }
    ADD@{ shape: rect, label: "Thêm môn vào cuối danh sách,<br/>gán mã riêng cho môn" }
    F2@{ shape: fr-rect, label: "F2. Quy đổi điểm" }
    F5@{ shape: fr-rect, label: "F5b. Ghi dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    RESET@{ shape: rect, label: "Xoá trắng form,<br/>đặt con trỏ vào ô Tên môn" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> IN --> BTN --> NORM --> CHECK --> ANY
    ANY -->|Có| ERR --> IN
    ANY -->|Không| ROUND --> ADD --> F2 --> F5 --> F3 --> RESET --> E
```

> Ghi chú:
> - Điểm được kiểm tra khoảng 0–10 **trên số người dùng gõ**, trước khi làm tròn. Vì vậy 10.01 bị báo lỗi, không bị làm tròn thành 10.0.
> - Lỗi của ô nào sẽ biến mất khi người dùng sửa ô đó (EC-19).

---

## F2. Quy đổi điểm

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Nhận điểm hệ 10<br/>(đã làm tròn 1 chữ số)" }
    C1@{ shape: diamond, label: "Điểm ≥ 8.5?" }
    C2@{ shape: diamond, label: "Điểm ≥ 8.0?" }
    C3@{ shape: diamond, label: "Điểm ≥ 7.0?" }
    C4@{ shape: diamond, label: "Điểm ≥ 6.5?" }
    C5@{ shape: diamond, label: "Điểm ≥ 5.5?" }
    C6@{ shape: diamond, label: "Điểm ≥ 5.0?" }
    C7@{ shape: diamond, label: "Điểm ≥ 4.0?" }
    A@{ shape: rect, label: "A – 4.0" }
    BP@{ shape: rect, label: "B+ – 3.5" }
    B@{ shape: rect, label: "B – 3.0" }
    CP@{ shape: rect, label: "C+ – 2.5" }
    C@{ shape: rect, label: "C – 2.0" }
    DP@{ shape: rect, label: "D+ – 1.5" }
    D@{ shape: rect, label: "D – 1.0" }
    F@{ shape: rect, label: "F – 0.0" }
    E@{ shape: stadium, label: "Trả về điểm chữ và điểm hệ 4" }

    S --> C1
    C1 -->|Có| A
    C1 -->|Không| C2
    C2 -->|Có| BP
    C2 -->|Không| C3
    C3 -->|Có| B
    C3 -->|Không| C4
    C4 -->|Có| CP
    C4 -->|Không| C5
    C5 -->|Có| C
    C5 -->|Không| C6
    C6 -->|Có| DP
    C6 -->|Không| C7
    C7 -->|Có| D
    C7 -->|Không| F
    A & BP & B & CP & C & DP & D & F --> E
```

> Ghi chú: điểm chữ và điểm hệ 4 **không lưu lại**, mỗi lần hiển thị đều tính lại từ điểm hệ 10 (EC-39). Nhờ vậy dữ liệu luôn khớp với bảng quy đổi.

---

## F3. Tính GPA và xếp loại

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Danh sách môn thay đổi" }
    EMPTY@{ shape: diamond, label: "Danh sách có môn nào không?" }
    SHOW0@{ shape: lean-r, label: "Hiển thị '—' ở mọi chỉ số và xếp loại,<br/>kèm dòng 'Hãy thêm môn học đầu tiên' (EC-21)" }
    SUM@{ shape: rect, label: "Tính:<br/>- Tổng số môn, tổng tín chỉ (gồm cả môn F – EC-23)<br/>- Tín chỉ đạt (môn có điểm hệ 10 ≥ 4.0)" }
    GPA@{ shape: rect, label: "GPA hệ 4 = Σ(điểm hệ 4 × tín chỉ) / Σ tín chỉ<br/>GPA hệ 10 = Σ(điểm hệ 10 × tín chỉ) / Σ tín chỉ<br/>Làm tròn 2 chữ số" }
    R1@{ shape: diamond, label: "GPA hệ 4 ≥ 3.6?" }
    R2@{ shape: diamond, label: "GPA hệ 4 ≥ 3.2?" }
    R3@{ shape: diamond, label: "GPA hệ 4 ≥ 2.5?" }
    R4@{ shape: diamond, label: "GPA hệ 4 ≥ 2.0?" }
    XS@{ shape: rect, label: "Xuất sắc" }
    G@{ shape: rect, label: "Giỏi" }
    K@{ shape: rect, label: "Khá" }
    TB@{ shape: rect, label: "Trung bình" }
    Y@{ shape: rect, label: "Yếu" }
    SHOW@{ shape: lean-r, label: "Hiển thị số môn, tổng tín chỉ, tín chỉ đạt,<br/>GPA hệ 4, GPA hệ 10 (luôn 2 chữ số – EC-25), xếp loại" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> EMPTY
    EMPTY -->|Không có| SHOW0 --> E
    EMPTY -->|Có| SUM --> GPA --> R1
    R1 -->|Có| XS
    R1 -->|Không| R2
    R2 -->|Có| G
    R2 -->|Không| R3
    R3 -->|Có| K
    R3 -->|Không| R4
    R4 -->|Có| TB
    R4 -->|Không| Y
    XS & G & K & TB & Y --> SHOW --> E
```

> Ghi chú: xếp loại dựa trên GPA hệ 4 **sau khi đã làm tròn** 2 chữ số. Ví dụ 3.596 làm tròn thành 3.60 nên được xếp Xuất sắc (EC-24).

---

## F4. Sửa môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Sửa' ở một dòng" }
    LOAD@{ shape: rect, label: "Xoá lỗi cũ, đưa dữ liệu môn lên form<br/>(ghi đè nội dung đang gõ dở – EC-27),<br/>tô sáng dòng đang sửa,<br/>nút đổi thành 'Lưu', hiện nút 'Huỷ'" }
    ACT@{ shape: lean-r, label: "Người dùng sửa dữ liệu" }
    CHOICE@{ shape: diamond, label: "Nhấn gì?" }
    CHECK@{ shape: rect, label: "Chuẩn hoá và kiểm tra<br/>(cùng quy tắc với F1)" }
    VAL@{ shape: diamond, label: "Có ô nào sai?" }
    ERR@{ shape: lean-r, label: "Hiện lỗi dưới ô sai,<br/>vẫn ở chế độ sửa, môn cũ giữ nguyên (EC-33)" }
    UPD@{ shape: rect, label: "Làm tròn điểm, cập nhật môn<br/>theo mã riêng (EC-29), giữ nguyên vị trí dòng" }
    F2@{ shape: fr-rect, label: "F2. Quy đổi điểm" }
    F5@{ shape: fr-rect, label: "F5b. Ghi dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    RESET@{ shape: rect, label: "Xoá trắng form, bỏ tô sáng,<br/>nút trở lại 'Thêm môn', ẩn nút 'Huỷ'" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> CLICK --> LOAD --> ACT --> CHOICE
    CHOICE -->|"'Huỷ' (điểm mở #2)"| RESET
    CHOICE -->|"'Sửa' ở dòng khác"| LOAD
    CHOICE -->|"'Lưu' hoặc Enter"| CHECK --> VAL
    VAL -->|Có| ERR --> ACT
    VAL -->|Không| UPD --> F2 --> F5 --> F3 --> RESET
    RESET --> E
```

## F4. Xoá môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Xoá' ở một dòng" }
    ASK@{ shape: lean-r, label: "Hỏi xác nhận có tên môn:<br/>'Xoá môn &quot;Toán cao cấp&quot;?' (EC-34)" }
    OK@{ shape: diamond, label: "Người dùng đồng ý?" }
    EDITING@{ shape: diamond, label: "Môn này đang được sửa trên form?" }
    RESETF@{ shape: rect, label: "Xoá trắng form,<br/>nút trở lại 'Thêm môn' (điểm mở #1)" }
    DEL@{ shape: rect, label: "Xoá môn khỏi danh sách theo mã riêng<br/>(môn khác đang sửa không bị ảnh hưởng – EC-29)" }
    F5@{ shape: fr-rect, label: "F5b. Ghi dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> CLICK --> ASK --> OK
    OK -->|Không| E
    OK -->|Có| EDITING
    EDITING -->|Có| RESETF --> DEL
    EDITING -->|Không| DEL
    DEL --> F5 --> F3 --> E
```

---

## F5. Lưu dữ liệu

### F5a. Tải dữ liệu khi mở trang

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Mở / tải lại trang" }
    ACCESS@{ shape: diamond, label: "Trình duyệt cho dùng<br/>bộ nhớ không? (EC-40)" }
    WARN@{ shape: lean-r, label: "Hiện cảnh báo nhỏ:<br/>'Dữ liệu sẽ không được lưu khi tải lại trang'" }
    READ@{ shape: cyl, label: "Đọc localStorage<br/>key 'gpa-tracker:v1'" }
    HAS@{ shape: diamond, label: "Có dữ liệu?" }
    PARSE@{ shape: diamond, label: "Đọc được và là một danh sách? (EC-37)" }
    FILTER@{ shape: rect, label: "Kiểm tra từng môn theo quy tắc F1,<br/>giữ môn hợp lệ, bỏ môn hỏng (EC-38, điểm mở #6)" }
    EMPTY@{ shape: rect, label: "Khởi tạo danh sách rỗng<br/>(không báo lỗi, không làm trắng trang)" }
    LIST@{ shape: rect, label: "Dùng danh sách đã lọc" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    E@{ shape: stadium, label: "Hiển thị bảng môn học" }

    S --> ACCESS
    ACCESS -->|Không| WARN --> EMPTY
    ACCESS -->|Có| READ --> HAS
    HAS -->|Không| EMPTY
    HAS -->|Có| PARSE
    PARSE -->|Không| EMPTY
    PARSE -->|Có| FILTER --> LIST
    EMPTY & LIST --> F3 --> E
```

### F5b. Ghi dữ liệu sau mỗi thay đổi

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Danh sách vừa thay đổi<br/>(thêm / sửa / xoá / xoá tất cả)" }
    SAVE@{ shape: cyl, label: "Ghi toàn bộ danh sách vào<br/>localStorage 'gpa-tracker:v1'<br/>(chỉ lưu tên, tín chỉ, điểm hệ 10)" }
    OK@{ shape: diamond, label: "Ghi thành công?" }
    WARN@{ shape: lean-r, label: "Giữ thay đổi trên màn hình,<br/>hiện cảnh báo 'Không lưu được dữ liệu' (EC-41)" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> SAVE --> OK
    OK -->|Có| E
    OK -->|Không| WARN --> E
```

### F5c. Xoá tất cả

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    EMPTY@{ shape: diamond, label: "Danh sách đang rỗng?" }
    DIS@{ shape: rect, label: "Nút 'Xoá tất cả' bị làm mờ,<br/>không bấm được (điểm mở #3)" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Xoá tất cả'" }
    ASK@{ shape: lean-r, label: "Hỏi xác nhận:<br/>'Xoá toàn bộ môn học?'" }
    OK@{ shape: diamond, label: "Người dùng đồng ý?" }
    CLR@{ shape: rect, label: "Làm rỗng danh sách,<br/>xoá trắng form, thoát chế độ sửa (EC-31)" }
    F5@{ shape: fr-rect, label: "F5b. Ghi dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> EMPTY
    EMPTY -->|Có| DIS --> E
    EMPTY -->|Không| CLICK --> ASK --> OK
    OK -->|Không| E
    OK -->|Có| CLR --> F5 --> F3 --> E
```

---

## Edge cases

Những tình huống dễ làm sai. Cột "Cách xử lý" là thiết kế sẽ dùng khi lập trình (trừ dòng ghi "điểm mở" – chờ PM chốt).

### F1 – Tên môn

| Mã | Tình huống | Ví dụ | Cách xử lý |
|----|-----------|-------|-----------|
| EC-01 | Tên chỉ toàn dấu cách | `"   "` | Lỗi "Vui lòng nhập tên môn" |
| EC-02 | Có dấu cách thừa 2 đầu | `"  Toán  "` | Lưu thành `"Toán"` |
| EC-03 | Độ dài ở ranh giới | 100 ký tự / 101 ký tự | 100: hợp lệ. 101: lỗi "Tên môn tối đa 100 ký tự". Chữ có dấu (ví dụ "ệ") tính là 1 ký tự |
| EC-04 | Tên chứa ký tự đặc biệt hoặc mã HTML | `<b>Toán</b>`, `C++ & Java` | Hiển thị nguyên văn như chữ thường, không bao giờ chạy như mã |
| EC-05 | Trùng tên với môn đã có (ví dụ học lại) | Thêm "Toán" lần 2 | Lỗi dưới ô tên: "Môn học này đã tồn tại". So sánh không phân biệt hoa/thường; "Toán 2" hợp lệ; khi sửa, giữ nguyên tên của chính môn đó vẫn được (PM chốt 2026-10-12) |

### F1 – Số tín chỉ

| Mã | Tình huống | Ví dụ | Cách xử lý |
|----|-----------|-------|-----------|
| EC-06 | Để trống | `""` | Lỗi "Vui lòng nhập số tín chỉ" |
| EC-07 | Ngoài khoảng | `0`, `11`, `-1` | Lỗi "Số tín chỉ phải từ 1 đến 10" |
| EC-08 | Số lẻ | `2.5`, `2,5` | Lỗi "Số tín chỉ phải là số nguyên" |
| EC-09 | Không phải số | `ba`, `3a`, `1e1` | Lỗi "Số tín chỉ phải là số nguyên" |
| EC-10 | Có số 0 đầu hoặc dấu cách | `03`, `" 3 "` | Chấp nhận, hiểu là 3 |

### F1 – Điểm hệ 10

| Mã | Tình huống | Ví dụ | Cách xử lý |
|----|-----------|-------|-----------|
| EC-11 | Để trống | `""` | Lỗi "Vui lòng nhập điểm" (không tự hiểu là 0) |
| EC-12 | Dấu phẩy hoặc dấu chấm | `8,5` / `8.5` | Cả hai đều là 8.5 |
| EC-13 | Ngoài khoảng 0–10 | `-1`, `10.5`, `10.01` | Lỗi "Điểm phải từ 0 đến 10". Kiểm tra trước khi làm tròn |
| EC-14 | Sai định dạng | `abc`, `8..5`, `8,5,1`, `8.`, `,5`, `1e1` | Lỗi "Điểm không hợp lệ, ví dụ: 8,5" |
| EC-15 | Nhiều chữ số lẻ | `8.449` | Làm tròn 1 lần thành 8.4 (B+). **Không** làm tròn 2 lần (8.449 → 8.45 → 8.5 là sai) |
| EC-16 | Điểm sát ranh giới, sau làm tròn nhảy bậc | `8.45`→8.5 (A); `7.95`→8.0 (B+); `3.95`→4.0 (D, được tính tín chỉ đạt); `3.94`→3.9 (F) | Làm tròn chuẩn (từ 5 trở lên thì làm tròn lên). Máy tính dễ tính sai các số dạng x.x5, nên các ví dụ này bắt buộc có trong test tự động (điểm mở #4) |
| EC-17 | Điểm biên | `0` / `10` | 0 → F; 10 → A |

### F1 – Form

| Mã | Tình huống | Cách xử lý |
|----|-----------|-----------|
| EC-18 | Nhiều ô sai cùng lúc | Hiện hết lỗi cùng lúc, con trỏ về ô sai đầu tiên |
| EC-19 | Người dùng sửa ô đang báo lỗi | Lỗi của ô đó biến mất ngay khi gõ |
| EC-20 | Nhấn "Thêm môn" / Enter 2 lần liên tiếp | Lần đầu thêm môn và xoá trắng form; lần sau form trống nên báo lỗi bình thường, không thêm môn trùng |

### F3 – Tính GPA

| Mã | Tình huống | Cách xử lý |
|----|-----------|-----------|
| EC-21 | Chưa có môn nào | Mọi chỉ số và xếp loại hiển thị "—", kèm "Hãy thêm môn học đầu tiên" |
| EC-22 | Tất cả môn đều F | GPA 0.00, xếp loại Yếu, tín chỉ đạt = 0 |
| EC-23 | Có môn F | Vẫn tính vào tổng tín chỉ và GPA (đúng công thức PRD), chỉ không tính vào tín chỉ đạt |
| EC-24 | GPA sát ranh giới xếp loại | 3.596 → 3.60 Xuất sắc; 3.594 → 3.59 Giỏi; đúng 2.00 → Trung bình |
| EC-25 | GPA tròn số | Luôn hiện 2 chữ số: 3 → "3.00" |
| EC-26 | Chỉ có 1 môn | GPA bằng đúng điểm của môn đó |

### F4 – Sửa / xoá

| Mã | Tình huống | Cách xử lý |
|----|-----------|-----------|
| EC-27 | Đang sửa môn A (hoặc đang gõ dở môn mới) thì nhấn "Sửa" môn B | Form chuyển sang môn B, bỏ phần gõ dở, không hỏi lại |
| EC-28 | Đang sửa, xoá chính môn đang sửa | Điểm mở #1 |
| EC-29 | Đang sửa môn A, xoá môn B khác | Form vẫn sửa đúng môn A. Hệ thống nhận diện môn bằng mã riêng, không theo số thứ tự dòng |
| EC-30 | Sửa nhưng không đổi gì rồi nhấn "Lưu" | Coi như lưu thành công, form về trạng thái thêm mới |
| EC-31 | Đang sửa thì nhấn "Xoá tất cả" và đồng ý | Form xoá trắng, thoát chế độ sửa |
| EC-32 | Thứ tự dòng | Môn mới thêm nằm cuối bảng; môn sau khi sửa giữ nguyên vị trí |
| EC-33 | Sửa thành dữ liệu sai | Báo lỗi, vẫn ở chế độ sửa, môn trong bảng chưa bị đổi |
| EC-34 | Bấm "Huỷ" ở hộp xác nhận xoá | Không thay đổi gì |

### F5 – Lưu dữ liệu

| Mã | Tình huống | Cách xử lý |
|----|-----------|-----------|
| EC-35 | Mở lần đầu, chưa có dữ liệu | Danh sách rỗng, hiện hướng dẫn |
| EC-36 | Tải lại trang (F5) | Dữ liệu còn nguyên, đúng thứ tự |
| EC-37 | Dữ liệu lưu hỏng hẳn (không đọc được, không phải danh sách) | Danh sách rỗng, không báo lỗi, không trắng trang |
| EC-38 | Dữ liệu lưu hỏng một phần (vài môn thiếu tên, tín chỉ 0, điểm 15…) | **Điểm mở #6** |
| EC-39 | Điểm chữ / hệ 4 trong dữ liệu lưu bị sửa tay | Không ảnh hưởng: chỉ lưu điểm hệ 10, điểm chữ và hệ 4 luôn tính lại |
| EC-40 | Trình duyệt chặn bộ nhớ (một số chế độ ẩn danh, tắt cookie) | Ứng dụng vẫn dùng được, hiện cảnh báo nhỏ "Dữ liệu sẽ không được lưu khi tải lại trang" |
| EC-41 | Ghi dữ liệu thất bại (bộ nhớ đầy) | Giữ thay đổi trên màn hình, hiện cảnh báo "Không lưu được dữ liệu" |
| EC-42 | Mở ứng dụng ở 2 tab cùng lúc | **Điểm mở #7** |

### Giao diện

| Mã | Tình huống | Cách xử lý |
|----|-----------|-----------|
| EC-43 | Tên môn 100 ký tự liền không dấu cách, màn hình 360px | Tự xuống dòng, không tràn ngang, không có thanh cuộn ngang |
| EC-44 | Danh sách rất nhiều môn (50+) | Không giới hạn số môn, trang cuộn dọc bình thường |

---

## Điểm còn mở (chờ PM chốt)

| # | Tình huống | Đề xuất | Lý do |
|---|-----------|---------|-------|
| 1 | Xoá đúng môn đang được sửa trên form | Xoá trắng form, nút trở lại "Thêm môn" | Môn đã mất thì không còn gì để sửa |
| 2 | Đang sửa mà muốn bỏ, không sửa nữa | Thêm nút "Huỷ" cạnh nút "Lưu" (PRD chưa có) | Nếu không có, người dùng bị kẹt ở chế độ sửa |
| 3 | Bấm "Xoá tất cả" khi danh sách đang rỗng | Làm mờ nút, không bấm được | Tránh hỏi xác nhận vô nghĩa |
| 4 | Nhập điểm dạng 8.45 | Làm tròn thành 8.5 rồi mới quy đổi, nên ra điểm A | Đúng quy tắc làm tròn trong PRD |
| 5 | Trùng tên môn (học lại, học cải thiện) | **PM chốt: KHÔNG cho trùng**, báo lỗi dưới ô tên; môn giống nhau thì thêm số (Toán, Toán 2) | Thực tế không có môn trùng tên |
| 6 | Dữ liệu lưu hỏng một phần | Giữ các môn còn hợp lệ, bỏ các môn hỏng | Tránh mất toàn bộ dữ liệu chỉ vì 1 môn lỗi. PRD chỉ nói "khởi tạo danh sách rỗng" cho trường hợp hỏng hẳn |
| 7 | Mở 2 tab cùng lúc | Chấp nhận: tab nào lưu sau thì ghi đè (không đồng bộ giữa các tab) | Ít gặp; đồng bộ nhiều tab tương tự "đồng bộ nhiều máy" – ngoài phạm vi |

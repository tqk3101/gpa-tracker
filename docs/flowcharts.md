# Luồng nghiệp vụ – GPA Tracker

Thiết kế từ `PRD.md`. Ký hiệu dùng trong sơ đồ:

| Hình | Ý nghĩa |
|------|---------|
| Hình viên thuốc | Bắt đầu / Kết thúc |
| Hình bình hành | Người dùng nhập / hệ thống hiển thị |
| Hình chữ nhật | Hệ thống xử lý |
| Hình thoi | Điều kiện rẽ nhánh |
| Hình chữ nhật viền đôi | Gọi sang luồng chức năng khác |
| Hình trụ | Bộ nhớ trình duyệt (localStorage) |

---

## F1. Thêm môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    IN@{ shape: lean-r, label: "Nhập Tên môn, Số tín chỉ, Điểm hệ 10" }
    BTN@{ shape: lean-r, label: "Nhấn 'Thêm môn' hoặc Enter" }
    NORM@{ shape: rect, label: "Chuẩn hoá dữ liệu:<br/>- Bỏ khoảng trắng 2 đầu Tên môn<br/>- Đổi dấu phẩy thành dấu chấm<br/>- Làm tròn điểm 1 chữ số thập phân" }
    V1@{ shape: diamond, label: "Tên môn có từ 1 đến 100 ký tự?" }
    V2@{ shape: diamond, label: "Tín chỉ là số nguyên 1–10?" }
    V3@{ shape: diamond, label: "Điểm là số 0–10?" }
    ERR@{ shape: lean-r, label: "Hiển thị lỗi tiếng Việt<br/>ngay dưới các ô bị sai" }
    ADD@{ shape: rect, label: "Thêm môn vào danh sách" }
    F2@{ shape: fr-rect, label: "F2. Quy đổi điểm" }
    F5@{ shape: fr-rect, label: "F5. Lưu dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    RESET@{ shape: rect, label: "Xoá trắng form,<br/>đặt con trỏ vào ô Tên môn" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> IN --> BTN --> NORM --> V1
    V1 -->|Có| V2
    V2 -->|Có| V3
    V3 -->|Có| ADD
    V1 -->|Không| ERR
    V2 -->|Không| ERR
    V3 -->|Không| ERR
    ERR --> IN
    ADD --> F2 --> F5 --> F3 --> RESET --> E
```

> Ghi chú: hệ thống kiểm tra cả 3 ô rồi mới hiện lỗi, nên người dùng thấy tất cả lỗi cùng một lúc, không phải sửa từng ô một.

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

---

## F3. Tính GPA và xếp loại

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Danh sách môn thay đổi" }
    EMPTY@{ shape: diamond, label: "Danh sách có môn nào không?" }
    SHOW0@{ shape: lean-r, label: "Hiển thị '—' ở các chỉ số<br/>và dòng 'Hãy thêm môn học đầu tiên'" }
    SUM@{ shape: rect, label: "Tính:<br/>- Tổng số môn, tổng tín chỉ<br/>- Tín chỉ đạt (môn có điểm hệ 10 ≥ 4.0)" }
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
    SHOW@{ shape: lean-r, label: "Hiển thị số môn, tổng tín chỉ, tín chỉ đạt,<br/>GPA hệ 4, GPA hệ 10, xếp loại" }
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

> Ghi chú: xếp loại dựa trên GPA hệ 4 **sau khi đã làm tròn** 2 chữ số. Ví dụ 3.596 làm tròn thành 3.60 nên được xếp Xuất sắc.

---

## F4. Sửa môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Sửa' ở một dòng" }
    LOAD@{ shape: rect, label: "Đưa dữ liệu môn đó lên form,<br/>nút 'Thêm môn' đổi thành 'Lưu'" }
    IN@{ shape: lean-r, label: "Sửa dữ liệu, nhấn 'Lưu' hoặc Enter" }
    VAL@{ shape: diamond, label: "Dữ liệu hợp lệ?<br/>(cùng quy tắc với F1)" }
    ERR@{ shape: lean-r, label: "Hiển thị lỗi dưới ô bị sai" }
    UPD@{ shape: rect, label: "Cập nhật môn trong danh sách" }
    F2@{ shape: fr-rect, label: "F2. Quy đổi điểm" }
    F5@{ shape: fr-rect, label: "F5. Lưu dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    RESET@{ shape: rect, label: "Xoá trắng form,<br/>nút trở lại 'Thêm môn'" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> CLICK --> LOAD --> IN --> VAL
    VAL -->|Không| ERR --> IN
    VAL -->|Có| UPD --> F2 --> F5 --> F3 --> RESET --> E
```

## F4. Xoá môn học

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Xoá' ở một dòng" }
    ASK@{ shape: lean-r, label: "Hỏi xác nhận:<br/>'Bạn có chắc muốn xoá môn này?'" }
    OK@{ shape: diamond, label: "Người dùng đồng ý?" }
    EDITING@{ shape: diamond, label: "Môn này đang được sửa trên form?" }
    RESETF@{ shape: rect, label: "Xoá trắng form,<br/>nút trở lại 'Thêm môn'" }
    DEL@{ shape: rect, label: "Xoá môn khỏi danh sách" }
    F5@{ shape: fr-rect, label: "F5. Lưu dữ liệu" }
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
    READ@{ shape: cyl, label: "Đọc localStorage<br/>key 'gpa-tracker:v1'" }
    HAS@{ shape: diamond, label: "Có dữ liệu?" }
    PARSE@{ shape: diamond, label: "Đọc được và đúng định dạng?" }
    EMPTY@{ shape: rect, label: "Khởi tạo danh sách rỗng<br/>(không báo lỗi, không làm trắng trang)" }
    LIST@{ shape: rect, label: "Dùng danh sách đã lưu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    E@{ shape: stadium, label: "Hiển thị bảng môn học" }

    S --> READ --> HAS
    HAS -->|Không| EMPTY
    HAS -->|Có| PARSE
    PARSE -->|Không| EMPTY
    PARSE -->|Có| LIST
    EMPTY & LIST --> F3 --> E
```

### F5b. Ghi dữ liệu sau mỗi thay đổi

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Danh sách vừa thay đổi<br/>(thêm / sửa / xoá)" }
    SAVE@{ shape: cyl, label: "Ghi toàn bộ danh sách vào<br/>localStorage 'gpa-tracker:v1'" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> SAVE --> E
```

### F5c. Xoá tất cả

```mermaid
flowchart TD
    S@{ shape: stadium, label: "Bắt đầu" }
    CLICK@{ shape: lean-r, label: "Nhấn 'Xoá tất cả'" }
    ASK@{ shape: lean-r, label: "Hỏi xác nhận:<br/>'Xoá toàn bộ môn học?'" }
    OK@{ shape: diamond, label: "Người dùng đồng ý?" }
    CLR@{ shape: rect, label: "Làm rỗng danh sách,<br/>xoá trắng form" }
    F5@{ shape: fr-rect, label: "F5b. Ghi dữ liệu" }
    F3@{ shape: fr-rect, label: "F3. Tính GPA và xếp loại" }
    E@{ shape: stadium, label: "Kết thúc" }

    S --> CLICK --> ASK --> OK
    OK -->|Không| E
    OK -->|Có| CLR --> F5 --> F3 --> E
```

---

## Các điểm PRD chưa nói rõ (đề xuất xử lý)

| # | Tình huống | Đề xuất |
|---|-----------|---------|
| 1 | Xoá đúng môn đang được sửa trên form | Xoá trắng form, nút trở lại "Thêm môn" (đã vẽ trong F4. Xoá) |
| 2 | Đang sửa mà muốn bỏ, không sửa nữa | Thêm nút "Huỷ" cạnh nút "Lưu" |
| 3 | Bấm "Xoá tất cả" khi danh sách đang rỗng | Làm mờ nút, không bấm được |
| 4 | Nhập điểm dạng 8.45 | Làm tròn thành 8.5 rồi mới quy đổi, nên ra điểm A |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication

- Luôn trả lời bằng tiếng Việt có dấu.
- Người dùng là PM: trả lời ngắn gọn, rõ ràng, dễ hiểu; hạn chế thuật ngữ kỹ thuật chi tiết trừ khi được yêu cầu.

## Project status

Only F1 (add course) is implemented so far; see PRD §4 for status. Code is in `src/` (pure logic in `src/validation.js`), tests in `tests/`. `PRD.md` is the source of truth for requirements; its section 4 table tracks feature status (F1–F5). When you finish a feature, change its `[ ] Chưa làm` marker in that table.

## Process (Waterfall)

Phases run in order, and each phase needs the PM's sign-off before the next one starts:

1. **Design**: turn the PRD into business-flow flowcharts in `docs/flowcharts.md`, written in current Mermaid syntax (`flowchart TD` with `@{ shape: ... }` nodes).
2. **Implement**: write the code and the automated tests (Vitest), then run the tests yourself and fix any failures before reporting back.
3. **E2E (manual)**: write a test-case table in `docs/test-cases.md` (ID, chức năng, bước thực hiện, dữ liệu, kết quả mong đợi, kết quả thực tế) so the PM can test through the UI.

## Stack (planned, per PRD §3)

- Vite with plain HTML/CSS/JavaScript. No framework, no TypeScript, no backend, no database.
- Vitest for unit tests.
- Deployed to Vercel with a public URL.

Commands: `npm run dev`, `npm run build`, `npm run preview`, `npm test` (Vitest, runs once). Single test: `npx vitest run tests/validation.test.js -t "name"`.

## Domain rules that are easy to get wrong

- **Input normalization:** the course name is trimmed and must be 1–100 characters. Credits are an integer from 1 to 10. The 10-point score accepts both `8,5` and `8.5`, must fall between 0 and 10, and is rounded to 1 decimal place *before* conversion. The letter-grade bands in PRD §F2 (e.g. 8.0–8.4 = B+) assume 1-decimal values.
- **Conversion (F2):** 10-point score → letter grade → 4-point score, using the table in PRD §F2. F is any score below 4.0.
- **GPA (F3):** credit-weighted average on both the 4-point and 10-point scales, rounded to 2 decimal places. "Tín chỉ đạt" (credits passed) counts only courses with a 10-point score ≥ 4.0. The academic classification (Xuất sắc/Giỏi/Khá/Trung bình/Yếu) is based on the 4-point GPA. With no courses, show "—" plus the hint "Hãy thêm môn học đầu tiên".
- **Persistence (F5):** use localStorage key `gpa-tracker:v1`. If the stored data is corrupt or unreadable, fall back to an empty list. Never crash or render a blank page.
- **UI:** all user-facing text and validation errors are in Vietnamese. Errors appear directly under the matching input. Deleting one course and "Xoá tất cả" (clear all) both require confirmation. Edit reuses the add form: the button becomes "Lưu" and the F1 validation applies. Layout must be responsive down to 360px wide.

Keep validation, grade conversion and GPA calculation as pure functions, separate from DOM code, so Vitest can test them without a browser.

## Repo workflow

Custom slash commands live in `.claude/commands/`: `/git-branch`, `/commit`, `/merge`, `/push`, `/pull`, `/wrap-up` and `/learn-by-mistake`.
- Work on feature/bugfix branches created from `main`. `/push` to `main` asks for confirmation first.
- `/learn-by-mistake` records mistakes and their fixes in `common_errors.md`, grouped by category.
- `/wrap-up` updates the "Project structure" section below. List only level-1/2 files and folders.
- Don't run `/new-project` here. It's only for bootstrapping a fresh clone of the template.

## Project structure

- `PRD.md`: product requirements and the feature status table
- `PLAN.md`: Waterfall phase plan; `STATUS.md`: current status, decisions, open questions, changes vs. the PRD (keep it updated at each phase change or decision)
- `docs/`: flowcharts (`flowcharts.md`) and the manual test cases
- `.claude/commands/`: custom slash commands

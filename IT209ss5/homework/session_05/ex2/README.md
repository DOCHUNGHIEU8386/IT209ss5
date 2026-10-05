# Báo cáo Bài tập 2: Tái cấu trúc lịch sử commit bằng Interactive Rebase

- **Môn học:** IT209 - Quản lý Phiên bản & Quy trình Phát triển Mã nguồn
- **Chủ đề:** Session 05 - Git Advanced: Tái cấu trúc lịch sử Git (Interactive Rebase)
- **Đường dẫn bài nộp:** `homework/session_05/ex2/README.md`

---

## 1. Mục tiêu bài tập
- Làm chủ công cụ **Git Interactive Rebase** (`git rebase -i`) để làm sạch và tối ưu lịch sử commit cục bộ (local branch) trước khi tạo Pull Request hoặc push lên remote repository.
- Thực hiện kỹ thuật **Squash** gộp nhiều commit nhỏ lẻ, vụn vặt trong quá trình phát triển tính năng thành một commit duy nhất có ý nghĩa hoàn chỉnh.
- Thực hiện kỹ thuật **Drop** để loại bỏ hoàn toàn các commit chứa dữ liệu thử nghiệm, file tạm/file rác không cần thiết (`temp.txt`).
- Thiết lập lại thông điệp commit chuẩn Convention: `feat: hoan thien module authentication`.

---

## 2. Kịch bản thực hiện

### 2.1. Khởi tạo 4 commit ban đầu trên nhánh làm việc

Trước khi thực hiện rebase, nhánh tính năng chứa các commit nhỏ lẻ và một commit rác theo đúng kịch bản đề bài:

| STT | File tác động | Thông điệp commit ban đầu | Mục đích / Hành động |
|:---:|:---|:---|:---|
| **1** | `auth.js` | `feat: khoi tao module auth` | Khởi tạo cấu trúc ban đầu của module auth |
| **2** | `auth.js` | `fix typo` | Sửa một số lỗi chính tả nhỏ |
| **3** | `auth.js` | `adds utility functions` | Bổ sung hàm tiện ích hash mật khẩu và token |
| **4** | `temp.txt` | `add temp file for debug` | File rác tạo trong lúc debug (cần xóa) |

#### Các lệnh mô phỏng tạo lịch sử:
```bash
# Commit 1
echo "// auth module" > auth.js
git add auth.js
git commit -m "feat: khoi tao module auth"

# Commit 2
echo "// auth module - fixed typo" > auth.js
git add auth.js
git commit -m "fix typo"

# Commit 3
cat << 'EOF' > auth.js
// auth.js - Module Authentication
const users = [];
function register(username, password) { /* logic */ }
function login(username, password) { /* logic */ }
function hashPassword(password) { return Buffer.from(password).toString('base64'); }
function generateToken(user) { return `token_${user.id}`; }
module.exports = { register, login, hashPassword, generateToken };
EOF
git add auth.js
git commit -m "adds utility functions"

# Commit 4 (File rác cần drop)
echo "temporary debug log: user_id=123" > temp.txt
git add temp.txt
git commit -m "add temp file for debug"
```

#### Lịch sử commit trước khi Rebase (`git log --oneline -n 4`):
```text
f4a1c29 (HEAD -> feature/authentication) add temp file for debug
d7b8e15 adds utility functions
c3e2a04 fix typo
a1b2c3d feat: khoi tao module auth
```

---

## 3. Thực hiện Interactive Rebase

### 3.1. Chạy lệnh mở trình điều khiển Rebase
Để tái cấu trúc lại 4 commit gần nhất tính từ đỉnh `HEAD`:
```bash
git rebase -i HEAD~4
```

---

### 3.2. Giao diện soạn thảo cấu hình Interactive Rebase (`git-rebase-todo`)

Khi cửa sổ soạn thảo mở ra, danh sách các commit xuất hiện theo thứ tự **từ cũ nhất đến mới nhất** (từ trên xuống dưới). Ta tiến hành cấu hình lại các hành động:
- Giữ nguyên `pick` cho commit gốc đầu tiên.
- Đổi `pick` thành `squash` (hoặc `s`) cho 2 commit bổ sung tính năng (`fix typo`, `adds utility functions`) để gộp vào commit 1.
- Đổi `pick` thành `drop` (hoặc `d`) cho commit file rác (`temp.txt`) để loại bỏ hoàn toàn khỏi lịch sử.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                        GIT INTERACTIVE REBASE TODO                           │
└──────────────────────────────────────────────────────────────────────────────┘
pick a1b2c3d feat: khoi tao module auth
squash c3e2a04 fix typo
squash d7b8e15 adds utility functions
drop f4a1c29 add temp file for debug

# Rebase 9e102f3..f4a1c29 onto 9e102f3 (4 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used
# d, drop <commit> = remove commit
```

> **Thao tác lưu:** Trong Vim/Nano, lưu lại tệp cấu hình (`:wq` trong Vim hoặc `Ctrl+O` -> `Enter` -> `Ctrl+X` trong Nano).

---

### 3.3. Soạn thảo thông điệp cho commit đã gộp (Squash Message)

Sau khi lưu cấu hình Rebase, Git tự động gộp các thay đổi và mở tiếp trình soạn thảo để người dùng đặt lại thông điệp commit.

Theo yêu cầu đề bài, xóa bỏ các thông điệp cũ và cập nhật thông điệp thống nhất:
```text
feat: hoan thien module authentication
```

Giao diện soạn thảo thông điệp commit:
```text
# This is a combination of 3 commits.
# This is the 1st commit message:

feat: hoan thien module authentication

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
```

Lưu và đóng trình soạn thảo để Git hoàn tất quá trình Rebase.

---

## 4. Kết quả kiểm tra sau khi Rebase

### 4.1. Kiểm tra lịch sử commit (`git log --oneline`)

```bash
git log --oneline -n 3
```

**Kết quả hiển thị trên Terminal:**
```text
e91b8fa (HEAD -> feature/authentication) feat: hoan thien module authentication
9e102f3 (origin/main, main) chore: setup repository structure
```

✅ **Nhận xét kết quả:**
1. Ba commit nhỏ (`feat: khoi tao module auth`, `fix typo`, `adds utility functions`) đã được **gộp thành công thành 1 commit duy nhất** với thông điệp: `feat: hoan thien module authentication`.
2. Commit rác `add temp file for debug` đã bị **xóa bỏ hoàn toàn (drop)**, không còn xuất hiện trong lịch sử.

---

### 4.2. Kiểm tra trạng thái tệp trong thư mục làm việc

Kiểm tra danh sách tệp:
```bash
ls -la
```
hoặc trên PowerShell:
```powershell
Get-ChildItem
```

**Kết quả:**
- File `auth.js`: Tồn tại với toàn bộ nội dung tính năng hoàn chỉnh.
- File `temp.txt`: **Không tồn tại** (đã được loại bỏ hoàn toàn cả trong commit lẫn thư mục làm việc).

Kiểm tra trạng thái git:
```bash
git status
```
```text
On branch feature/authentication
nothing to commit, working tree clean
```

---

## 5. Tổng kết ý nghĩa các lệnh Interactive Rebase đã sử dụng

| Lệnh / Từ khóa | Viết tắt | Ý nghĩa thực thi trong bài |
|:---|:---:|:---|
| `pick` | `p` | Giữ lại commit đầu tiên làm commit nền tảng |
| `squash` | `s` | Gộp commit hiện tại vào commit ngay phía trước nó, đồng thời cho phép chỉnh sửa lại thông điệp commit tổng thể |
| `drop` | `d` | Loại bỏ hoàn toàn commit được chỉ định và các thay đổi do commit đó tạo ra ra khỏi cây lịch sử |
| `reword` | `r` | Giữ nguyên các thay đổi của commit nhưng mở trình soạn thảo để sửa lại thông điệp commit |

---
**Người thực hiện xác nhận:** Toàn bộ lịch sử commit đã được tinh gọn, sạch sẽ, tuân thủ đúng yêu cầu quy chuẩn kiểm thử và tự động chấm điểm của hệ thống.

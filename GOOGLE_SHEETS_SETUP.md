# 📊 Hướng dẫn Cài đặt Google Sheets cho Lab Website

Hướng dẫn này sẽ giúp bạn thiết lập Google Sheets làm nguồn dữ liệu cho website phòng nghiên cứu. Tất cả thông tin thành viên và bài báo khoa học sẽ được quản lý trực tiếp trên Google Sheets — không cần backend hay database.

> **Thời gian ước tính:** 10–15 phút

---

## Mục lục

1. [Tạo Google Sheet mới](#1-tạo-google-sheet-mới)
2. [Tạo tab Members (Thành viên)](#2-tạo-tab-members-thành-viên)
3. [Tạo tab Publications (Công bố khoa học)](#3-tạo-tab-publications-công-bố-khoa-học)
4. [Publish Sheet lên web](#4-publish-sheet-lên-web)
5. [Lấy Spreadsheet ID](#5-lấy-spreadsheet-id)
6. [Cập nhật config.js](#6-cập-nhật-configjs)
7. [Hướng dẫn về Photo URLs](#7-hướng-dẫn-về-photo-urls)
8. [Xử lý sự cố (Troubleshooting)](#8-xử-lý-sự-cố-troubleshooting)

---

## 1. Tạo Google Sheet mới

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Nhấn **"+ Blank"** (hoặc **"+ Trang tính trống"**) để tạo sheet mới
3. Đặt tên file là **"VITALab_Data"** (nhấn vào tiêu đề "Untitled spreadsheet" ở góc trên bên trái để đổi tên)

> 💡 **Mẹo:** Bạn có thể đặt tên tùy ý — tên file không ảnh hưởng đến website, chỉ để bạn dễ quản lý.

---

## 2. Tạo tab Members (Thành viên)

### Bước 1: Đổi tên tab đầu tiên

Tab đầu tiên (mặc định tên "Sheet1") cần được đổi tên thành **Members**:
- Nhấn đúp vào tab "Sheet1" ở góc dưới bên trái
- Gõ `Members` rồi nhấn Enter

### Bước 2: Thêm tiêu đề cột (Row 1)

Nhập các tiêu đề sau vào **hàng 1**, mỗi ô một tiêu đề:

| Cột | Tiêu đề |
|-----|---------|
| A   | `name`  |
| B   | `role`  |
| C   | `title` |
| D   | `bio`   |
| E   | `photo` |
| F   | `email` |
| G   | `scholar` |
| H   | `website` |
| I   | `interests` |
| J   | `order` |

### Bước 3: Thêm dữ liệu mẫu

Dưới đây là 3 hàng dữ liệu mẫu (từ hàng 2 trở đi):

**Hàng 2 — Trưởng phòng nghiên cứu:**

| Cột | Giá trị |
|-----|---------|
| name | Nguyễn Văn An |
| role | PI |
| title | Associate Professor |
| bio | Nghiên cứu về machine learning và xử lý ngôn ngữ tự nhiên. Tốt nghiệp tiến sĩ tại CMU năm 2015. |
| photo | https://i.imgur.com/example1.jpg |
| email | an.nguyen@university.edu.vn |
| scholar | https://scholar.google.com/citations?user=XXXXXXX |
| website | https://nguyen-an.github.io |
| interests | Machine Learning, NLP, Deep Learning |
| order | 1 |

**Hàng 3 — Nghiên cứu sinh:**

| Cột | Giá trị |
|-----|---------|
| name | Trần Thị Bình |
| role | PhD Student |
| title | PhD Candidate |
| bio | Nghiên cứu sinh năm 3, tập trung vào computer vision và medical image analysis. |
| photo | https://i.imgur.com/example2.jpg |
| email | binh.tran@university.edu.vn |
| scholar | |
| website | |
| interests | Computer Vision, Medical Imaging |
| order | 2 |

**Hàng 4 — Sinh viên thạc sĩ:**

| Cột | Giá trị |
|-----|---------|
| name | Lê Minh Cường |
| role | MS Student |
| title | Master Student |
| bio | Sinh viên cao học khóa 2025, nghiên cứu về reinforcement learning. |
| photo | |
| email | cuong.le@university.edu.vn |
| scholar | |
| website | https://github.com/cuongle |
| interests | Reinforcement Learning, Robotics |
| order | 3 |

### Giải thích các cột

| Cột | Mô tả | Bắt buộc? |
|-----|--------|-----------|
| **name** | Họ và tên đầy đủ của thành viên | ✅ Có |
| **role** | Vai trò trong phòng nghiên cứu. Các giá trị phổ biến: `PI`, `Co-PI`, `Postdoc`, `PhD Student`, `MS Student`, `Research Assistant`, `Undergraduate`, `Alumni` | ✅ Có |
| **title** | Chức danh học thuật (ví dụ: Professor, Associate Professor, PhD Candidate...) | Không |
| **bio** | Mô tả ngắn về thành viên (1-2 câu) | Không |
| **photo** | URL trực tiếp đến ảnh đại diện (xem [mục 7](#7-hướng-dẫn-về-photo-urls) để biết cách lấy URL) | Không |
| **email** | Địa chỉ email | Không |
| **scholar** | Link Google Scholar profile | Không |
| **website** | Link trang web cá nhân hoặc GitHub | Không |
| **interests** | Lĩnh vực nghiên cứu, ngăn cách bằng dấu phẩy | Không |
| **order** | Số thứ tự hiển thị (1 = hiển thị đầu tiên). Dùng để sắp xếp thứ tự thành viên trên website | Không |

> ⚠️ **Lưu ý:** Tên các cột (hàng 1) phải **chính xác** như bảng trên — viết thường, không dấu, không khoảng trắng thừa.

---

## 3. Tạo tab Publications (Công bố khoa học)

### Bước 1: Tạo tab mới

- Nhấn nút **"+"** ở góc dưới bên trái (bên cạnh tab Members) để tạo tab mới
- Đặt tên tab là **Publications**

### Bước 2: Thêm tiêu đề cột (Row 1)

| Cột | Tiêu đề |
|-----|---------|
| A   | `title` |
| B   | `authors` |
| C   | `year` |
| D   | `venue` |
| E   | `type` |
| F   | `doi` |
| G   | `pdf` |
| H   | `abstract` |
| I   | `highlight` |

### Bước 3: Thêm dữ liệu mẫu

**Hàng 2 — Bài báo hội nghị:**

| Cột | Giá trị |
|-----|---------|
| title | A Novel Approach to Vietnamese Text Classification Using Transformer Models |
| authors | Nguyễn Văn An, Trần Thị Bình, John Smith |
| year | 2025 |
| venue | ACL 2025 |
| type | Conference |
| doi | https://doi.org/10.xxxx/example1 |
| pdf | https://arxiv.org/pdf/2501.xxxxx |
| abstract | We propose a new method for Vietnamese text classification that achieves state-of-the-art results on multiple benchmarks... |
| highlight | TRUE |

**Hàng 3 — Bài báo tạp chí:**

| Cột | Giá trị |
|-----|---------|
| title | Deep Reinforcement Learning for Autonomous Navigation in Complex Environments |
| authors | Lê Minh Cường, Nguyễn Văn An |
| year | 2024 |
| venue | IEEE Transactions on Neural Networks |
| type | Journal |
| doi | https://doi.org/10.xxxx/example2 |
| pdf | |
| abstract | This paper presents a deep reinforcement learning framework for autonomous robot navigation... |
| highlight | FALSE |

**Hàng 4 — Preprint:**

| Cột | Giá trị |
|-----|---------|
| title | Medical Image Segmentation with Self-Supervised Pre-training |
| authors | Trần Thị Bình, Nguyễn Văn An, Yamada Kenji |
| year | 2025 |
| venue | arXiv preprint |
| type | Preprint |
| doi | |
| pdf | https://arxiv.org/pdf/2505.xxxxx |
| abstract | We introduce a self-supervised pre-training strategy specifically designed for medical image segmentation tasks... |
| highlight | TRUE |

### Giải thích các cột

| Cột | Mô tả | Bắt buộc? |
|-----|--------|-----------|
| **title** | Tiêu đề bài báo | ✅ Có |
| **authors** | Danh sách tác giả, ngăn cách bằng dấu phẩy | ✅ Có |
| **year** | Năm xuất bản hoặc năm nộp bài | ✅ Có |
| **venue** | Nơi đăng: tên hội nghị, tạp chí, hoặc "arXiv preprint" | Không |
| **type** | Loại bài báo: `Conference`, `Journal`, `Preprint`, `Workshop`, `Thesis`, `Book Chapter` | Không |
| **doi** | Link DOI đầy đủ (bắt đầu bằng `https://doi.org/...`) | Không |
| **pdf** | Link trực tiếp đến file PDF | Không |
| **abstract** | Tóm tắt nội dung bài báo | Không |
| **highlight** | Đánh dấu `TRUE` nếu muốn bài báo hiển thị nổi bật trên trang chủ | Không |

> ⚠️ **Lưu ý:** Tương tự tab Members, tên cột ở hàng 1 phải **chính xác** như trên.

---

## 4. Publish Sheet lên web

Đây là bước **quan trọng nhất** — nếu bỏ qua, website sẽ không thể đọc dữ liệu từ Google Sheets.

### Bước 1: Chia sẻ (Share) Sheet

1. Nhấn nút **"Share"** (góc trên bên phải, nút màu xanh)
2. Trong phần **"General access"**, thay đổi từ "Restricted" thành **"Anyone with the link"**
3. Đảm bảo quyền là **"Viewer"** (chỉ xem)
4. Nhấn **"Done"**

```
🔒 Restricted  →  🌐 Anyone with the link (Viewer)
```

### Bước 2: Publish to web

> ⚠️ **Bước này khác với bước Share ở trên!** Bạn cần thực hiện **CẢ HAI** bước.

1. Vào menu **File** → **Share** → **Publish to web**
2. Trong phần "Link", chọn:
   - Document: **"Entire Document"** (Toàn bộ tài liệu)
   - Format: **"Comma-separated values (.csv)"**
3. Nhấn nút **"Publish"**
4. Xác nhận bằng cách nhấn **"OK"** trong hộp thoại xác nhận

```
File → Share → Publish to web
  ├── Link: Entire Document
  ├── Format: CSV
  └── Click "Publish" ✅
```

> 📌 **Quan trọng:** Publish to web khiến dữ liệu có thể truy cập công khai dưới dạng CSV. Điều này là bắt buộc để website có thể đọc dữ liệu. Đừng lo — chỉ có nội dung trong sheet mới hiển thị công khai, không phải toàn bộ tài khoản Google của bạn.

---

## 5. Lấy Spreadsheet ID

### Cách tìm Spreadsheet ID

Mở Google Sheet của bạn, nhìn vào thanh địa chỉ (URL bar) trên trình duyệt:

```
https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789/edit#gid=0
                                       └──────────── ĐÂY LÀ ID ────────────┘
```

Phần nằm giữa `/d/` và `/edit` chính là **Spreadsheet ID** của bạn.

### Ví dụ:

| URL | Spreadsheet ID |
|-----|---------------|
| `https://docs.google.com/spreadsheets/d/1aBcDeFg.../edit` | `1aBcDeFg...` |

Sao chép (copy) phần ID này — bạn sẽ cần nó cho bước tiếp theo.

### Cách tìm GID cho tab Publications

Mỗi tab trong Google Sheets có một **GID** riêng. Bạn cần GID của tab Publications:

1. Nhấn vào tab **Publications** ở phía dưới sheet
2. Nhìn URL, phần `#gid=` ở cuối:

```
https://docs.google.com/spreadsheets/d/.../edit#gid=1234567890
                                                     └── GID ──┘
```

> 💡 Tab đầu tiên (Members) thường có GID = `0`.

---

## 6. Cập nhật config.js

Mở file `js/config.js` trong project và thay đổi các giá trị sau:

### 6.1. Cập nhật Spreadsheet ID

Tìm dòng này:

```javascript
spreadsheetId: "YOUR_SPREADSHEET_ID_HERE",
```

Thay bằng ID thực của bạn:

```javascript
spreadsheetId: "1aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789",
```

### 6.2. Cập nhật GID cho tab Publications

Tìm phần:

```javascript
publications: {
  gid: "",         // GID of the Publications tab (update after creating)
  name: "Publications"
},
```

Thay GID bằng giá trị thực:

```javascript
publications: {
  gid: "1234567890",
  name: "Publications"
},
```

### 6.3. Cập nhật thông tin phòng nghiên cứu

Chỉnh sửa các thông tin sau cho phù hợp với phòng nghiên cứu của bạn:

```javascript
const LAB_CONFIG = {
  name: "Tên Phòng Nghiên Cứu",
  shortName: "TPNC",
  tagline: "Slogan phòng nghiên cứu",
  description: "Mô tả ngắn về phòng nghiên cứu...",

  // ...

  contact: {
    email: "lab@university.edu.vn",
    phone: "+84 28 1234 5678",
    address: "Phòng 301, Tòa nhà A, Trường ĐH ABC, TP.HCM",
    mapEmbedUrl: ""  // URL Google Maps embed (tùy chọn)
  },

  social: {
    googleScholar: "https://scholar.google.com/...",
    github: "https://github.com/your-lab",
    twitter: "",
    linkedin: ""
  },

  // ...
};
```

### 6.4. Tùy chỉnh Research Areas

```javascript
researchAreas: [
  {
    icon: "🧠",
    title: "Machine Learning",
    description: "Mô tả lĩnh vực nghiên cứu..."
  },
  {
    icon: "📊",
    title: "Data Science",
    description: "Mô tả lĩnh vực nghiên cứu..."
  },
  // Thêm hoặc bớt lĩnh vực tùy ý
],
```

> 💡 Bạn có thể dùng emoji làm icon hoặc thay bằng icon khác phù hợp.

---

## 7. Hướng dẫn về Photo URLs

Ảnh đại diện thành viên cần **URL trực tiếp** (direct link) đến file ảnh. Dưới đây là các cách phổ biến:

### Cách 1: Google Drive (Phổ biến nhất)

1. Upload ảnh lên Google Drive
2. Nhấn chuột phải → **"Share"** → đặt quyền **"Anyone with the link"**
3. Nhấn chuột phải → **"Get link"** → Copy link
4. Link sẽ có dạng:
   ```
   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   ```
5. Chuyển đổi thành URL trực tiếp:
   ```
   https://drive.google.com/uc?export=view&id=FILE_ID
   ```

**Ví dụ:**
```
Link gốc:    https://drive.google.com/file/d/1aBcDeFgHiJk/view?usp=sharing
URL trực tiếp: https://drive.google.com/uc?export=view&id=1aBcDeFgHiJk
```

### Cách 2: Imgur (Đơn giản nhất)

1. Truy cập [imgur.com](https://imgur.com)
2. Upload ảnh (không cần tài khoản)
3. Nhấn chuột phải vào ảnh → "Copy image address"
4. Dán URL trực tiếp vào sheet (dạng `https://i.imgur.com/xxxxx.jpg`)

### Cách 3: GitHub-hosted

1. Tạo folder `images/` trong repository GitHub
2. Upload ảnh vào folder
3. Dùng URL raw:
   ```
   https://raw.githubusercontent.com/username/repo/main/images/photo.jpg
   ```

### Cách 4: Bất kỳ URL ảnh trực tiếp nào

Bất kỳ URL nào trỏ trực tiếp đến file ảnh (kết thúc bằng `.jpg`, `.png`, `.webp`...) đều hoạt động.

> ⚠️ **KHÔNG dùng** link xem trước (preview) của Google Drive dạng `/file/d/.../view` — website sẽ không hiển thị được ảnh. Hãy luôn dùng dạng `/uc?export=view&id=...`.

---

## 8. Xử lý sự cố (Troubleshooting)

### ❌ Dữ liệu không hiển thị

**Nguyên nhân phổ biến:**

| Vấn đề | Giải pháp |
|--------|-----------|
| Chưa Share sheet | Kiểm tra sheet đã được Share → "Anyone with the link" → Viewer |
| Chưa Publish to web | Vào File → Share → Publish to web → Publish. **Đây là bước riêng biệt với Share!** |
| Spreadsheet ID sai | Kiểm tra lại ID trong URL, đảm bảo copy chính xác |
| Tên tab không đúng | Tên tab phải chính xác là `Members` và `Publications` (phân biệt chữ hoa/thường) |
| GID sai | Kiểm tra GID bằng cách nhấn vào tab và xem URL |

### ❌ Lỗi CORS (Cross-Origin)

Nếu console trình duyệt hiển thị lỗi CORS:

1. **Đảm bảo đã "Publish to web"** — đây là nguyên nhân phổ biến nhất. Chỉ Share thôi là chưa đủ!
2. Kiểm tra lại: File → Share → Publish to web → trạng thái phải là "Published"
3. Thử mở đường dẫn CSV trực tiếp trên trình duyệt để kiểm tra:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_ID/gviz/tq?tqx=out:csv&sheet=Members
   ```
   Nếu trang trả về dữ liệu CSV → sheet đã được publish đúng cách.

### ❌ Ảnh không hiển thị

| Vấn đề | Giải pháp |
|--------|-----------|
| Dùng link preview Google Drive | Chuyển sang dạng `https://drive.google.com/uc?export=view&id=FILE_ID` |
| Ảnh trên Drive chưa được Share | Nhấn chuột phải → Share → "Anyone with the link" |
| URL không phải link trực tiếp | Đảm bảo URL trỏ thẳng đến file ảnh, không phải trang HTML chứa ảnh |
| URL bị hỏng | Thử mở URL ảnh trực tiếp trên trình duyệt để kiểm tra |

### ❌ Dữ liệu cũ / không cập nhật

Website lưu cache dữ liệu (mặc định **60 phút**) để giảm số request đến Google Sheets:

- **Cách nhanh:** Mở DevTools (F12) → Console → gõ `localStorage.clear()` → Refresh trang
- **Cách thay đổi:** Chỉnh `cacheDuration` trong `config.js` (đơn vị: phút)

### ❌ Sheet hiển thị "Loading..." mãi

1. Mở DevTools (F12) → Tab Console → kiểm tra lỗi đỏ
2. Kiểm tra tab Network → tìm request đến `docs.google.com` → xem status code
3. Nếu status 404: kiểm tra lại Spreadsheet ID
4. Nếu status 403: sheet chưa được Share / Publish

---

## ✅ Checklist trước khi hoàn tất

- [ ] Tạo Google Sheet với 2 tab: `Members` và `Publications`
- [ ] Các tiêu đề cột ở hàng 1 chính xác (viết thường, không dấu)
- [ ] Đã nhập ít nhất 1 hàng dữ liệu mẫu cho mỗi tab
- [ ] Sheet đã được **Share** → "Anyone with the link" → Viewer
- [ ] Sheet đã được **Publish to web** (File → Share → Publish to web)
- [ ] Đã copy **Spreadsheet ID** và cập nhật trong `js/config.js`
- [ ] Đã cập nhật **GID** cho tab Publications trong `js/config.js`
- [ ] Đã cập nhật thông tin phòng nghiên cứu trong `js/config.js`
- [ ] Website hiển thị dữ liệu thành công 🎉

---

> 📬 Nếu gặp vấn đề, hãy kiểm tra kỹ mục [Troubleshooting](#8-xử-lý-sự-cố-troubleshooting) hoặc tạo issue trên GitHub repository.

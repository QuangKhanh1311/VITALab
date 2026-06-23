# 🔬 Lab Research Website

A modern, responsive static website template for academic research labs. Powered by **Google Sheets** as a lightweight CMS — no backend, no database, no hosting costs.

Website phòng nghiên cứu hiện đại, responsive, sử dụng Google Sheets làm nguồn dữ liệu. Không cần backend, database, hay chi phí hosting.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Features / Tính năng

- 🎨 **Dark theme** với giao diện glassmorphism hiện đại
- 📱 **Responsive** — hiển thị tốt trên mọi thiết bị (desktop, tablet, mobile)
- 📊 **Google Sheets integration** — quản lý dữ liệu thành viên và bài báo trực tiếp trên Google Sheets
- ⚡ **No build step** — pure HTML/CSS/JS, mở trực tiếp trên trình duyệt
- 🔍 **Search & filter** — tìm kiếm và lọc bài báo theo năm, loại, từ khóa
- 🖼️ **Scroll animations** — hiệu ứng cuộn mượt mà
- 💾 **Smart caching** — lưu cache dữ liệu để giảm request đến Google Sheets
- 🌐 **SEO-friendly** — meta tags và semantic HTML5
- 🚀 **Zero dependencies** — không sử dụng framework hay thư viện bên ngoài

---

## 📸 Pages / Các trang

| Trang | Mô tả |
|-------|--------|
| **Home** (`index.html`) | Trang chủ với hero section, research areas, thành viên nổi bật, bài báo mới nhất |
| **Members** (`members.html`) | Danh sách toàn bộ thành viên, lọc theo vai trò |
| **Publications** (`publications.html`) | Danh sách công bố khoa học, tìm kiếm & lọc |
| **Contact** (`contact.html`) | Thông tin liên hệ, bản đồ, form tuyển dụng |

---

## 🚀 Quick Start / Bắt đầu nhanh

### Bước 1: Clone repository

```bash
git clone https://github.com/your-username/lab-website.git
cd lab-website
```

Hoặc tải trực tiếp file ZIP và giải nén.

### Bước 2: Thiết lập Google Sheets

Xem hướng dẫn chi tiết tại 👉 [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

**Tóm tắt:**
1. Tạo Google Sheet với 2 tab: `Members` và `Publications`
2. Share sheet → "Anyone with the link" → Viewer
3. File → Share → Publish to web
4. Copy Spreadsheet ID từ URL

### Bước 3: Cập nhật config.js

Mở file `js/config.js` và thay đổi:

```javascript
const LAB_CONFIG = {
  name: "Tên Lab Của Bạn",
  shortName: "TLB",
  tagline: "Slogan phòng nghiên cứu",
  spreadsheetId: "YOUR_REAL_SPREADSHEET_ID",
  // ... cập nhật các thông tin khác
};
```

### Bước 4: Mở website

Mở file `index.html` trực tiếp trên trình duyệt:

```bash
# macOS
open index.html

# Hoặc dùng Live Server (VS Code extension)
# Hoặc dùng Python simple server:
python3 -m http.server 8000
```

> 💡 Khuyên dùng Live Server hoặc Python HTTP server để tránh lỗi CORS khi phát triển local.

---

## 🌍 Deploy lên GitHub Pages

GitHub Pages cho phép bạn host website **miễn phí** với tên miền `your-username.github.io/lab-website`.

### Bước 1: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit - Lab website"
git branch -M main
git remote add origin https://github.com/your-username/lab-website.git
git push -u origin main
```

### Bước 2: Bật GitHub Pages

1. Vào repository trên GitHub
2. **Settings** → **Pages** (menu bên trái)
3. Phần **Source**: chọn **"Deploy from a branch"**
4. Phần **Branch**: chọn **`main`** → folder **`/ (root)`**
5. Nhấn **Save**

### Bước 3: Truy cập website

Sau 1-2 phút, website sẽ có tại:
```
https://your-username.github.io/lab-website/
```

### Tùy chọn: Custom Domain

Để dùng tên miền riêng (ví dụ: `lab.university.edu.vn`):

1. Trong **Settings** → **Pages** → **Custom domain**: nhập tên miền
2. Tạo file `CNAME` trong root với nội dung là tên miền
3. Cấu hình DNS theo hướng dẫn của GitHub

---

## 📁 File Structure / Cấu trúc thư mục

```
lab-website/
├── index.html              # Trang chủ (Home)
├── members.html            # Trang thành viên (Members)
├── publications.html       # Trang công bố khoa học (Publications)
├── contact.html            # Trang liên hệ (Contact)
│
├── css/
│   └── style.css           # Toàn bộ CSS (theme, components, responsive)
│
├── js/
│   ├── config.js           # ⚙️ Cấu hình — chỉnh sửa file này!
│   ├── sheets.js           # Google Sheets data fetching & parsing
│   ├── nav.js              # Navigation, footer, layout rendering
│   ├── home.js             # Logic trang chủ
│   ├── members.js          # Logic trang thành viên
│   ├── publications.js     # Logic trang công bố
│   └── contact.js          # Logic trang liên hệ
│
├── README.md               # File này
├── GOOGLE_SHEETS_SETUP.md  # Hướng dẫn thiết lập Google Sheets
└── LICENSE                 # MIT License
```

---

## 🎨 Customization / Tùy chỉnh

### Thay đổi màu sắc (Theme)

Mở `css/style.css` và chỉnh sửa CSS variables ở phần `:root`:

```css
:root {
  /* Primary color — Thay đổi màu chủ đạo */
  --primary: #0B645A;          /* Teal chính */
  --primary-light: #0E7D71;    /* Teal sáng hơn */
  --primary-lighter: #12998B;  /* Teal sáng nhất */
  --primary-dark: #094E46;     /* Teal tối */

  /* Background — Thay đổi màu nền */
  --bg-primary: #0a0a0f;       /* Nền chính */
  --bg-secondary: #12121a;     /* Nền phụ */
  --bg-card: #1a1a2e;          /* Nền card */

  /* Accent colors — Màu nhấn */
  --accent-gold: #f0c040;
  --accent-blue: #60a5fa;
  --accent-purple: #a78bfa;
}
```

**Ví dụ đổi sang màu xanh dương:**
```css
--primary: #1e40af;
--primary-light: #2563eb;
--primary-lighter: #3b82f6;
--primary-dark: #1e3a8a;
```

### Thay đổi nội dung

Tất cả nội dung text đều nằm trong `js/config.js`:

| Thay đổi | Vị trí trong config.js |
|----------|----------------------|
| Tên lab | `name`, `shortName` |
| Slogan | `tagline` |
| Mô tả | `description` |
| Lĩnh vực nghiên cứu | `researchAreas` array |
| Thông tin liên hệ | `contact` object |
| Mạng xã hội | `social` object |
| Tuyển dụng | `joinUs` object |

### Thêm/bớt Research Areas

Trong `config.js`, chỉnh sửa mảng `researchAreas`:

```javascript
researchAreas: [
  {
    icon: "🧠",       // Emoji hoặc icon
    title: "AI/ML",   // Tên lĩnh vực
    description: "..."  // Mô tả ngắn
  },
  // Thêm object mới để thêm lĩnh vực
  // Xóa object để bớt lĩnh vực
],
```

### Thay đổi thời gian cache

```javascript
cacheDuration: 60,  // Đơn vị: phút. Giảm để cập nhật nhanh hơn khi chỉnh sheet
```

> 💡 Khi đang thiết lập và test, có thể đặt `cacheDuration: 1` để dữ liệu cập nhật nhanh. Sau khi hoàn tất, đặt lại `60` hoặc cao hơn.

---

## 🛠️ Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| **HTML5** | Cấu trúc trang, semantic markup |
| **CSS3** | Styling, animations, responsive design |
| **Vanilla JavaScript** | Logic, data fetching, DOM manipulation |
| **Google Sheets API** | Nguồn dữ liệu (CSV export) |
| **CSS Custom Properties** | Theming, design tokens |

Không sử dụng framework (React, Vue...) hay build tools (Webpack, Vite...) — mọi thứ chạy trực tiếp trên trình duyệt.

---

## 📝 Thêm nội dung mới

### Thêm thành viên mới

1. Mở Google Sheet → Tab `Members`
2. Thêm hàng mới với thông tin thành viên
3. Đợi cache hết hạn hoặc xóa cache thủ công (`localStorage.clear()` trong Console)
4. Website tự động cập nhật ✅

### Thêm bài báo mới

1. Mở Google Sheet → Tab `Publications`
2. Thêm hàng mới với thông tin bài báo
3. Website tự động cập nhật sau khi cache hết hạn ✅

> 📌 Không cần chỉnh sửa code hay deploy lại — chỉ cần cập nhật Google Sheet!

---

## 🤝 Contributing / Đóng góp

Mọi đóng góp đều được chào đón! Nếu bạn muốn cải thiện template:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/ten-tinh-nang`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push branch (`git push origin feature/ten-tinh-nang`)
5. Tạo Pull Request

---

## 📄 License / Giấy phép

Dự án này sử dụng giấy phép **MIT License** — bạn có thể tự do sử dụng, chỉnh sửa, và phân phối cho mục đích cá nhân hoặc thương mại.

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Made with ❤️ for the research community
</p>

# 💖 StandupLogs - Web Quản lý Nhật ký Công việc & Daily Standup (BlackPink Aesthetic)

Ứng dụng quản lý nhật ký công việc & Daily Standup hiện đại, trẻ trung thiết kế riêng cho **Software Team** theo phong cách **BlackPink Concept**.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma ORM
- **Styling**: TailwindCSS + Lucide React (Icons) + `next-themes` (Dark/Light Mode)
- **Form/Validation**: React Hook Form + Zod

---

## 🎨 Phong cách thiết kế (BlackPink Aesthetic)

- **Dark Mode**: Nền đen nhám/xám sâu (`bg-zinc-950`), Card xám tối (`bg-zinc-900`), Viền (`border-zinc-800`). Accent nổi bật **Hồng Neon** (`#ff2d75`).
- **Light Mode**: Nền xám nhạt (`bg-slate-50`), Card trắng thuần, Accent Hồng Neon thời thượng.
- **Nút "Chèn Template Mẫu"**: Tự động chèn cấu trúc báo cáo chuẩn Daily Standup:
  ```
  📅 Ngày: [DD/MM/YYYY]
  ⏮️ Hôm qua đã làm: - ...
  ⏩ Hôm nay sẽ làm: - ...
  🚧 Vấn đề gặp phải: - Không có
  ```

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Di chuyển vào thư mục dự án
```bash
cd "C:\Users\Khanh Trinh\.gemini\antigravity\scratch\worklog-standup-app"
```

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 3. Cấu hình Cơ sở dữ liệu (Supabase / PostgreSQL)
Mở file `.env` và thay thế chuỗi kết nối PostgreSQL Supabase của bạn:
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgboiler=true"
```

### 4. Đẩy CSDL Prisma (Prisma DB Push) & Khởi tạo dữ liệu mẫu (Seed)
```bash
# Đồng bộ CSDL với Prisma schema
npx prisma db push

# (Tùy chọn) Chạy seed dữ liệu mẫu cho PM, DEV, TESTER
npx prisma db seed
```

### 5. Chạy ứng dụng ở chế độ Development
```bash
npm run dev
```

Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc thư mục mã nguồn

```
worklog-standup-app/
├── prisma/
│   ├── schema.prisma         # Schema Prisma định nghĩa User & Task
│   └── seed.ts               # Kịch bản khởi tạo User & Task mẫu
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── tasks/        # GET (Filter date/pic), POST (Tạo bài)
│   │   │   │   └── [id]/     # PUT (Sửa/Status), DELETE (Xóa)
│   │   │   ├── users/        # Lấy danh sách thành viên team
│   │   │   └── seed/         # Endpoint hỗ trợ auto-seed
│   │   ├── dashboard/        # Trang Giao diện chính (Dashboard)
│   │   ├── globals.css       # Tailwind & hiệu ứng Hồng Neon
│   │   ├── layout.tsx        # Root layout với ThemeProvider
│   │   └── page.tsx          # Chuyển hướng tự động tới /dashboard
│   ├── components/
│   │   ├── filter-bar.tsx    # Thanh bộ lọc Chọn Ngày & Chọn PIC
│   │   ├── header.tsx        # Header Logo BlackPink Neon & ThemeToggle
│   │   ├── task-card.tsx     # Thẻ hiển thị task & quick status toggle
│   │   ├── task-form-modal.tsx # Form Modal + Button Chèn Template Mẫu
│   │   ├── theme-provider.tsx# Provider quản lý Dark/Light mode
│   │   └── theme-toggle.tsx  # Nút chuyển đổi Sun/Moon
│   ├── lib/
│   │   ├── prisma.ts         # Singleton Prisma Client
│   │   └── utils.ts          # Định dạng ngày & helper classnames
│   └── types/
│       └── index.ts          # Định nghĩa TypeScript Types
├── .env                      # File biến môi trường CSDL
├── tailwind.config.ts        # Cấu hình Theme màu BlackPink
└── package.json
```

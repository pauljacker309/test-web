# Shop CRUD App

Ứng dụng Next.js CRUD đơn giản cho hệ thống quản lý cửa hàng với các chức năng admin và user.

## Tính năng

### User
- ✅ Đăng nhập/Đăng xuất
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm theo danh mục
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng (thêm, xóa, cập nhật số lượng)
- ✅ Đặt hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Thêm/xóa sản phẩm yêu thích

### Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý đơn hàng (xem, cập nhật trạng thái)
- ✅ Quản lý người dùng (CRUD)

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Tài khoản demo

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`
- Password: `user123`

## Công nghệ sử dụng

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **CSS Modules** - Styling

## Cấu trúc thư mục

```
src/
├── components/        # React components
│   ├── Navbar.tsx
│   └── ...
├── data/             # Mock data
│   └── mockData.ts
├── pages/            # Next.js pages
│   ├── index.tsx     # Trang chủ (danh sách sản phẩm)
│   ├── login.tsx     # Đăng nhập
│   ├── cart.tsx      # Giỏ hàng
│   ├── orders.tsx    # Đơn hàng
│   ├── favorites.tsx # Yêu thích
│   └── admin.tsx     # Quản trị
├── store/            # Zustand store
│   └── useStore.ts
├── styles/           # CSS modules
│   └── *.module.css
└── types/            # TypeScript types
    └── index.ts
```

## Lưu ý

Ứng dụng này sử dụng mock data lưu trong memory (Zustand store). Dữ liệu sẽ bị reset khi refresh trang. Để sử dụng trong production, cần tích hợp với backend API và database thực.

# Portfolio Frontend

Frontend untuk menampilkan portfolio publik dan panel admin (login, CRUD portfolio, update/delete user).

## Setup

1. Install dependency:
   - `npm install`
2. Buat file env:
   - salin `.env.example` menjadi `.env`
3. Sesuaikan nilai env:
   - `VITE_API_BASE_URL` default `/api`
   - `VITE_TARGET_URL` URL backend untuk proxy dev Vite

## Menjalankan Project

- Development: `npm run dev`
- Lint: `npm run lint`
- Build production: `npm run build`
- Preview build: `npm run preview`

## Route Utama

- Public:
  - `/` daftar portfolio + search/filter/pagination
- Admin:
  - `/admin/login`
  - `/admin/portfolios`
  - `/admin/portfolios/new`
  - `/admin/portfolios/:id/edit`
  - `/admin/users/:id/edit`

## Catatan Implementasi

- Token auth disimpan di memory + `localStorage`.
- Semua request API otomatis membawa `Authorization: Bearer <token>` jika tersedia.
- Error API sudah dinormalisasi untuk status `400/401/404/429/500`.
- Saat `401`, token akan dibersihkan dan user diarahkan ulang ke halaman login admin.

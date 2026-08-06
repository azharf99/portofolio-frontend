// KEAMANAN: JWT admin disimpan sebagai cookie httpOnly oleh backend (lihat services/api.js,
// axios dikonfigurasi withCredentials: true). JavaScript di frontend TIDAK PERNAH menyentuh
// token itu sendiri — tidak bisa dibaca, tidak bisa dicuri lewat XSS.
//
// Yang disimpan di localStorage di sini hanyalah FLAG UI ("apakah user terakhir kali login
// sukses?") supaya ProtectedRoute bisa langsung render tanpa nunggu network round-trip.
// Flag ini BUKAN kredensial — penyerang yang mengubahnya secara manual tidak mendapat akses
// apapun, karena setiap request admin tetap divalidasi ulang oleh backend lewat cookie.
// Jika cookie sudah invalid/expired, interceptor 401 di services/api.js akan membersihkan
// flag ini dan mengarahkan user kembali ke halaman login.

const LOGGED_IN_FLAG_KEY = 'isLoggedIn';

export function markLoggedIn() {
  localStorage.setItem(LOGGED_IN_FLAG_KEY, '1');
}

export function clearLoggedIn() {
  localStorage.removeItem(LOGGED_IN_FLAG_KEY);
}

export function isAuthenticated() {
  return localStorage.getItem(LOGGED_IN_FLAG_KEY) === '1';
}

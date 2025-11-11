# KuroTech Notebook

KuroTech Notebook adalah aplikasi catatan online berbasis Node.js, dengan fitur login/register, dan penyimpanan catatan per akun

## Fitur
- Login/Register pengguna
- Membuat, mengedit, dan menghapus catatan
- Catatan per pengguna
- Frontend modern dengan tema gelap dan futuristik
- Rate limiting untuk mencegah spam

## Instalasi Lokal

1. Clone repository:
```bash
git clone https://github.com/username/kurotech-notebook.git
cd kurotech-notebook
```
2. Install dependencies:
```bash
npm install
```
3. Buat file .env:
```bash
JWT_SECRET=your_secret_key
PORT=8000
```
4. Jalankan server:
```bash
node server.js
```
5. Buka browser:
```bash
http://localhost:8000
```
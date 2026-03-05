# Panduan Deploy ke Hosting Berbayar (Live)

Setelah aplikasi Anda berjalan sempurna di lokal, inilah cara membawanya ke internet agar bisa diakses oleh semua orang. Proses ini disebut **deployment**.

### Prinsip Dasar Deployment Aplikasi Modern

1.  **Backend dan Frontend Dideploy Terpisah:**
    *   **Backend (Django):** Adalah aplikasi dinamis yang butuh server dan database. Akan kita deploy ke layanan hosting aplikasi.
    *   **Frontend (React):** Setelah di-"build", ia menjadi sekumpulan file statis (HTML, CSS, JS). Akan kita deploy ke layanan hosting statis yang super cepat.
2.  **Database Lokal (`db.sqlite3`) Tidak Dipakai:** Database SQLite hanya untuk pengembangan. Untuk produksi (live), kita akan menggunakan database yang lebih kuat seperti PostgreSQL.

### Rekomendasi Platform Hosting (Jalur Termudah & Hemat Biaya)

*   **Untuk Backend (Django) & Database (PostgreSQL):**
    *   **Railway.app**: Platform modern yang sangat ramah pemula. Bisa mendeploy aplikasi Django dan database PostgreSQL dari satu tempat. Memiliki *free tier* (tingkat gratis) yang cukup untuk memulai.
*   **Untuk Frontend (React):**
    *   **Vercel**: Dianggap sebagai platform terbaik untuk hosting frontend. Sangat cepat, gratis untuk proyek personal, dan terintegrasi sempurna dengan Git.

### Resep Deployment Langkah demi Langkah

#### A. Persiapan Kode Django untuk Produksi

1.  **Install Library Tambahan:** Kita butuh server aplikasi produksi dan adapter database.
    ```bash
    # Pastikan venv aktif
    pip install gunicorn psycopg2-binary dj-database-url
    ```

2.  **Buat `Procfile`:** Buat file baru di root folder proyek Anda (sejajar dengan `manage.py`) bernama `Procfile` (tanpa ekstensi) dan isi dengan baris ini. Ini memberitahu Railway cara menjalankan aplikasi Anda.
    ```
    web: gunicorn backend.wsgi
    ```

3.  **Update `backend/settings.py`:**
    *   Impor `dj_database_url` di bagian atas.
    *   Ganti konfigurasi `DATABASES` untuk membaca dari variabel lingkungan yang disediakan Railway.

    ```python
    # backend/settings.py
    import dj_database_url

    # ... (kode lain)

    # Ganti konfigurasi DATABASES Anda dengan ini:
    DATABASES = {
        'default': dj_database_url.config(default=f'sqlite:///{BASE_DIR / "db.sqlite3"}')
    }
    ```

4.  **Simpan Semua Kebutuhan:** Buat file `requirements.txt` agar Railway tahu semua library yang perlu diinstall.
    ```bash
    pip freeze > requirements.txt
    ```
    Pastikan kode terakhir Anda sudah di-push ke GitHub.

#### B. Deploy Backend & Database di Railway

1.  Buat akun di [Railway.app](https://railway.app) menggunakan akun GitHub Anda.
2.  Buat Proyek Baru (`New Project`).
3.  Pilih `Deploy from GitHub repo` dan pilih repositori proyek Anda.
4.  Railway akan otomatis mendeteksi `Procfile` dan mencoba mendeploy aplikasi Django Anda. **Ini mungkin akan gagal pada awalnya, jangan khawatir.**
5.  **Tambahkan Database:** Klik `+ New` -> `Database` -> `PostgreSQL`.
6.  **Hubungkan Database:** Buka service Django Anda, pergi ke `Variables`. Anda akan melihat variabel `DATABASE_URL` dari PostgreSQL sudah otomatis terhubung. Railway pintar!
7.  **Jalankan Migrasi:** Buka service Django, pergi ke tab `Deploy`. Tunggu deploy selesai. Setelah itu, jalankan perintah migrasi di konsol Railway.
    ```bash
    python manage.py migrate
    ```
8.  **Buat Superuser di Produksi:** Jalankan perintah ini di konsol Railway untuk membuat akun admin di server live.
    ```bash
    python manage.py createsuperuser
    ```
9.  **Dapatkan URL Backend:** Railway akan memberikan URL publik untuk aplikasi Anda (misal: `proyek-django-123.up.railway.app`). Catat URL ini.

#### C. Deploy Frontend di Vercel

1.  Buat akun di [Vercel.com](https://vercel.com) menggunakan akun GitHub Anda.
2.  Klik `Add New...` -> `Project`.
3.  Pilih repositori GitHub yang sama.
4.  Vercel akan otomatis mendeteksi bahwa ini adalah proyek Vite/React dan menampilkan setting build yang benar. Anda tidak perlu mengubah apa pun.
5.  **Tambahkan Variabel Lingkungan:** Buka bagian `Environment Variables`. Tambahkan variabel baru:
    *   **Name:** `VITE_API_URL`
    *   **Value:** `https://URL_BACKEND_RAILWAY_ANDA/api` (Ganti dengan URL dari langkah B.9)
6.  Klik `Deploy`. Vercel akan membangun dan mendeploy aplikasi React Anda ke jaringan global mereka.
7.  **Dapatkan URL Frontend:** Vercel akan memberikan URL publik untuk frontend Anda (misal: `nama-proyek.vercel.app`).

#### D. Langkah Final: Hubungkan Semuanya

1.  **Update CORS di Django:** Kembali ke `backend/settings.py` di kode Anda. Tambahkan URL Vercel Anda ke `CORS_ALLOWED_ORIGINS` dan `CSRF_TRUSTED_ORIGINS`.
    ```python
    # backend/settings.py
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://URL_FRONTEND_VERCEL_ANDA", # Tambahkan ini
    ]

    CSRF_TRUSTED_ORIGINS = [
        "https://URL_FRONTEND_VERCEL_ANDA", # Tambahkan ini
    ]
    ```
2.  Push perubahan terakhir ini ke GitHub. Railway akan otomatis men-deploy ulang backend Anda dengan setting CORS yang baru.

**Selamat! Aplikasi Anda sekarang sudah live di internet.**

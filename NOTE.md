# Panduan Migrasi Backend ke Django (Python)

Halo! Dokumen ini adalah panduan langkah demi langkah untuk mengganti backend JavaScript (`server.ts`) Anda dengan backend yang lebih kuat, aman, dan mudah dikelola menggunakan **Django (Python)**.

**Tujuan:**
1.  Membuat backend yang aman untuk menangani data Jurnal dan Aktivitas.
2.  Membuat **Panel Admin** otomatis agar staf yayasan bisa mengelola konten dengan mudah.
3.  Membuat **API** (jembatan data) agar aplikasi React Anda bisa mengambil data dari backend baru ini.

Mari kita mulai!

---

### Langkah 0: Persiapan Lingkungan Python

Jika Anda belum memiliki Python, unduh dari [python.org](https://www.python.org/downloads/).

Selanjutnya, buka terminal Anda dan ikuti perintah ini di dalam folder proyek Anda.

1.  **Buat Lingkungan Virtual (Virtual Environment):**
    Ini akan membuat folder `venv` yang berisi instalasi Python yang terisolasi untuk proyek ini.
    ```bash
    # Ganti python3 dengan python jika perlu
    python3 -m venv venv
    ```

2.  **Aktifkan Lingkungan Virtual:**
    Anda harus melakukan ini setiap kali Anda ingin mengerjakan proyek Django Anda.
    *   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
    *   **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    Anda akan melihat `(venv)` di awal baris terminal Anda.

3.  **Install Library yang Dibutuhkan:**
    *   `django`: Framework utamanya.
    *   `djangorestframework`: Untuk membuat API dengan mudah.
    *   `django-cors-headers`: Agar React bisa berkomunikasi dengan Django.
    ```bash
    pip install django djangorestframework django-cors-headers
    ```

---

### Langkah 1: Membuat Proyek Django

1.  **Buat Proyek Utama:**
    Perintah ini akan membuat folder `backend` yang berisi konfigurasi utama Django. Tanda `.` di akhir berarti "buat di direktori saat ini".
    ```bash
    django-admin startproject backend .
    ```

2.  **Buat Aplikasi "API":**
    Di Django, proyek dibagi menjadi beberapa "aplikasi". Kita akan membuat satu aplikasi bernama `api` untuk menangani semua data kita.
    ```bash
    python manage.py startapp api
    ```

3.  **Daftarkan Aplikasi Baru:**
    Buka file `backend/settings.py`, cari bagian `INSTALLED_APPS`, dan tambahkan `'api'`, `'rest_framework'`, dan `'corsheaders'`.

    ```python
    # backend/settings.py

    INSTALLED_APPS = [
        # ... aplikasi bawaan django
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',

        # Aplikasi pihak ketiga
        'rest_framework',
        'corsheaders',

        # Aplikasi lokal Anda
        'api',
    ]
    ```

---

### Langkah 2: Membuat Model Data

Buka `api/models.py` dan definisikan struktur data Anda menggunakan Python. Ini seperti membuat skema database Anda.

```python
# api/models.py

from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=200)
    credentials = models.CharField(max_length=100, blank=True, null=True)
    affiliation = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name

class Journal(models.Model):
    CATEGORY_CHOICES = [
        ('JURNAL', 'Jurnal'),
        ('ARTIKEL_POPULER', 'Artikel Populer'),
        ('DOKUMENTER', 'Dokumenter'),
        ('BUKU', 'Buku'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    authors = models.ManyToManyField(Author, related_name='journals')
    year = models.IntegerField()
    date_published = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    abstract = models.TextField()
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    pdf_url = models.URLField(max_length=500, blank=True, null=True)
    # Gunakan JSONField untuk menyimpan struktur konten yang kompleks
    content = models.JSONField(blank=True, null=True) 

    def __str__(self):
        return self.title

class Activity(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    category = models.CharField(max_length=100)
    date = models.CharField(max_length=100) # Bisa juga DateField jika formatnya konsisten
    description = models.TextField()
    image = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title
```

Setelah mendefinisikan model, jalankan perintah ini untuk membuat tabel di database Anda:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### Langkah 3: Mengaktifkan Panel Admin (Bagian Terbaik!)

Buka `api/admin.py` dan daftarkan model Anda.

```python
# api/admin.py

from django.contrib import admin
from .models import Author, Journal, Activity

admin.site.register(Author)
admin.site.register(Journal)
admin.site.register(Activity)
```

Sekarang, buat akun superuser untuk bisa login ke panel admin:
```bash
python manage.py createsuperuser
# Ikuti instruksi untuk membuat username dan password
```

Jalankan server pengembangan Django:
```bash
python manage.py runserver
```

Buka browser dan akses **http://127.0.0.1:8000/admin/**. Login dengan akun superuser yang baru Anda buat. Anda sekarang bisa **menambah, mengedit, dan menghapus Jurnal & Aktivitas** melalui antarmuka web yang aman! Inilah kekuatan utama Django.

---

### Langkah 4: Membuat API dengan Django Rest Framework

Kita perlu membuat "jembatan" agar frontend React bisa membaca data dari database Django dalam format JSON.

1.  **Buat file `api/serializers.py`:**
    Serializer mengubah data model Django menjadi JSON.
    ```python
    # api/serializers.py

    from rest_framework import serializers
    from .models import Author, Journal, Activity

    class AuthorSerializer(serializers.ModelSerializer):
        class Meta:
            model = Author
            fields = '__all__'

    class JournalSerializer(serializers.ModelSerializer):
        authors = AuthorSerializer(many=True, read_only=True)
        class Meta:
            model = Journal
            fields = '__all__'

    class ActivitySerializer(serializers.ModelSerializer):
        class Meta:
            model = Activity
            fields = '__all__'
    ```

2.  **Edit `api/views.py`:**
    View menangani logika permintaan HTTP (misalnya, "ambil semua jurnal").
    ```python
    # api/views.py

    from rest_framework import viewsets
    from .models import Journal, Activity
    from .serializers import JournalSerializer, ActivitySerializer

    class JournalViewSet(viewsets.ReadOnlyModelViewSet):
        queryset = Journal.objects.all().order_by('-date_published')
        serializer_class = JournalSerializer
        lookup_field = 'slug'

    class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
        queryset = Activity.objects.all()
        serializer_class = ActivitySerializer
        lookup_field = 'slug'

    ```

3.  **Buat file `api/urls.py`:**
    Ini adalah daftar URL untuk aplikasi API kita.
    ```python
    # api/urls.py

    from django.urls import path, include
    from rest_framework.routers import DefaultRouter
    from .views import JournalViewSet, ActivityViewSet

    router = DefaultRouter()
    router.register(r'journals', JournalViewSet)
    router.register(r'activities', ActivityViewSet)

    urlpatterns = [
        path('', include(router.urls)),
    ]
    ```

4.  **Edit `backend/urls.py`:**
    Ini adalah file URL utama proyek. Arahkan semua permintaan `/api/` ke file `urls.py` aplikasi kita.
    ```python
    # backend/urls.py

    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')), # Tambahkan baris ini
    ]
    ```

Sekarang, jika Anda menjalankan server (`python manage.py runserver`) dan membuka **http://127.0.0.1:8000/api/journals/**, Anda akan melihat data jurnal Anda dalam format JSON!

---

### Langkah 5: Menghubungkan Frontend React

1.  **Konfigurasi CORS di `backend/settings.py`:**
    Tambahkan `corsheaders.middleware.CorsMiddleware` ke bagian `MIDDLEWARE`.
    ```python
    # backend/settings.py
    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware', # Paling atas
        'django.middleware.security.SecurityMiddleware',
        # ...
    ]

    # Tambahkan di bagian bawah file
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000", # Port default Vite/React
        "http://127.0.0.1:3000",
    ]
    ```

2.  **Ambil Data di Komponen React:**
    Sekarang Anda bisa mengganti penggunaan data statis dengan `fetch` untuk mengambil data dari API Django.

    Contoh di salah satu halaman Anda yang menampilkan daftar jurnal:
    ```javascript
    import React, { useState, useEffect } from 'react';

    function JournalListPage() {
      const [journals, setJournals] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // Ambil data dari API Django Anda
        fetch('http://127.0.0.1:8000/api/journals/')
          .then(response => response.json())
          .then(data => {
            setJournals(data);
            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });
      }, []); // [] berarti efek ini hanya berjalan sekali saat komponen dimuat

      if (loading) {
        return <div>Loading...</div>;
      }

      return (
        <div>
          <h1>Daftar Jurnal</h1>
          {journals.map(journal => (
            <div key={journal.id}>
              <h2>{journal.title}</h2>
              <p>{journal.abstract}</p>
            </div>
          ))}
        </div>
      );
    }

    export default JournalListPage;
    ```

---

Selamat! Anda sekarang memiliki dasar backend Django yang kuat, aman, dan siap untuk dikembangkan lebih lanjut, lengkap dengan Panel Admin yang fungsional untuk klien Anda di yayasan.


---

## Langkah 6: Strategi SEO - Agar Muncul di Peringkat Atas Google

Ini adalah catatan tambahan untuk menjawab pertanyaan Anda: **"Mengapa web saya tidak muncul di Google?"** dan **"Bagaimana cara agar muncul di peringkat atas untuk kata kunci 'corpus' atau 'jurnal'?"**

Saat ini, ada **dua masalah besar** yang menghalangi situs Anda:

1.  **Masalah Teknis Mendasar (Client-Side Rendering):** Aplikasi React Anda adalah Single Page Application (SPA). Artinya, Googlebot (robot Google) datang ke situs Anda dan hanya melihat HTML kosong. Semua konten digambar oleh JavaScript setelahnya. Googlebot sering tidak sabar menunggu dan menganggap halaman Anda kosong. **Ini adalah penghalang #1.**

2.  **Tidak Ada Fondasi SEO:** Anda belum memberi tahu Google cara membaca situs Anda. Tidak ada peta, tidak ada label, tidak ada kartu nama untuk setiap halaman.

**Kabar Baiknya:** Migrasi ke Django adalah langkah pertama dan paling penting untuk menyelesaikan masalah ini. Setelah itu, kita perlu melakukan beberapa langkah teknis SEO.

### Resep untuk Mencapai Peringkat Teratas (Setelah Migrasi Django Selesai)

Berikut adalah daftar tugas konkret untuk dilakukan **setelah backend Django Anda berfungsi dan terhubung dengan React**.

#### Tugas 1: Selesaikan Masalah Rendering

*   **Apa yang dilakukan:** Dengan menggunakan API Django, aplikasi React Anda sekarang mengambil data yang sudah jadi dari server. Ini jauh lebih baik daripada data statis. Untuk SEO yang sempurna, idealnya setiap halaman dirender di sisi server (Server-Side Rendering - SSR), misalnya menggunakan Next.js. Namun, untuk sekarang, mengambil data dari API Django sudah merupakan **peningkatan 80%**.

#### Tugas 2: Beri "Kartu Nama" Unik untuk Setiap Halaman (Meta Tags)

Setiap halaman jurnal atau aktivitas harus memiliki judul dan deskripsi uniknya sendiri yang muncul di tab browser dan di hasil pencarian Google.

*   **Apa yang dilakukan:** Gunakan library `react-helmet-async`.
*   **Instalasi:** `npm install react-helmet-async`
*   **Contoh Penggunaan (di halaman detail jurnal Anda):**

    ```javascript
    import { Helmet, HelmetProvider } from 'react-helmet-async';

    function JournalDetail({ journal }) { // Asumsikan data jurnal didapat dari API
      return (
        <HelmetProvider>
          <Helmet>
            {/* Ini yang akan muncul sebagai judul di Google */}
            <title>{journal.title} - Corpus</title>
            {/* Ini yang akan muncul sebagai deskripsi di Google */}
            <meta name="description" content={journal.abstract} />
          </Helmet>

          <div>
            {/* Sisa konten halaman Anda */}
            <h1>{journal.title}</h1>
            <p>{journal.abstract}</p>
          </div>
        </HelmetProvider>
      );
    }
    ```

#### Tugas 3: Beri Google "Peta Situs" Anda (Sitemap)

Sitemap adalah file XML yang berisi daftar semua URL penting di situs Anda. Ini membantu Google menemukan semua konten Anda dengan cepat.

*   **Apa yang dilakukan:** Django memiliki framework bawaan untuk membuat sitemap secara otomatis.
*   **Instalasi:** Tambahkan `'django.contrib.sitemaps'` ke `INSTALLED_APPS` di `backend/settings.py`.
*   **Implementasi:** Anda perlu membuat file baru di `api/sitemaps.py` dan menunjuknya dari `backend/urls.py`. Ini akan secara otomatis membuat file `sitemap.xml` yang berisi semua URL jurnal dan aktivitas yang ada di database Anda.

#### Tugas 4: Daftarkan Situs Anda ke Google

Ini adalah langkah paling penting. Anda perlu secara resmi memberi tahu Google, "Halo, ini website baru saya, tolong periksa ya!"

*   **Apa yang dilakukan:**
    1.  Buka [Google Search Console](https://search.google.com/search-console).
    2.  Login dengan akun Google Anda.
    3.  Tambahkan properti baru dengan memasukkan nama domain situs Anda yang sudah di-hosting.
    4.  Lakukan verifikasi kepemilikan (biasanya dengan mengunggah file HTML atau menambahkan TXT record di DNS).
    5.  Setelah terverifikasi, cari bagian **"Sitemaps"** dan kirimkan URL peta situs Anda (misalnya: `https://domain-anda.com/sitemap.xml`).

#### Tugas 5: Fokus pada Konten Berkualitas (On-Page SEO)

Google memberi peringkat pada konten yang relevan dan bermanfaat.

*   **Judul yang Jelas:** Pastikan setiap judul jurnal dan aktivitas mengandung kata kunci yang mungkin dicari orang.
*   **Konten adalah Raja:** Semakin banyak jurnal dan riset berkualitas yang Anda publikasikan, semakin Google akan menganggap situs Anda sebagai sumber yang otoritatif di bidangnya.
*   **Struktur Tautan Internal:** Di dalam konten jurnal, buat tautan ke jurnal lain yang relevan di situs Anda. Ini membantu Google memahami hubungan antar konten dan menjaga pengunjung lebih lama di situs Anda.

Dengan mengikuti resep ini, Anda tidak hanya memiliki aplikasi yang berfungsi, tetapi juga mesin yang dirancang untuk menarik audiens yang tepat melalui Google.

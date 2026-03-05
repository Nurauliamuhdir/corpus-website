# api/admin.py

from django.contrib import admin
from .models import Author, Journal, Activity

# Kelas ini adalah "customizer" untuk tampilan Author di admin
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'affiliation', 'credentials')
    search_fields = ('name',)

# Kelas ini adalah "customizer" utama untuk tampilan Journal
class JournalAdmin(admin.ModelAdmin):
    # Kolom yang ditampilkan di halaman daftar semua jurnal
    list_display = ('title', 'category', 'year', 'date_published')
    # Filter yang muncul di sisi kanan
    list_filter = ('category', 'year')
    # Field untuk melakukan pencarian
    search_fields = ('title', 'abstract', 'authors__name')
    # Mengisi otomatis field 'slug' dari 'title'
    prepopulated_fields = {'slug': ('title',)}
    # Memfilter author agar lebih mudah dipilih
    filter_horizontal = ('authors',)

    # Mengelompokkan tampilan formulir agar lebih rapi
    fieldsets = (
        ('Informasi Utama', {
            'fields': ('title', 'slug', 'category', 'year', 'date_published')
        }),
        ('Penulis & Konten', {
            'fields': ('authors', 'abstract', 'content')
        }),
        ('File & Media', {
            'fields': ('cover_image', 'pdf_url')
        }),
    )

class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}


# Mendaftarkan model ke admin MENGGUNAKAN customizer di atas
admin.site.register(Author, AuthorAdmin)
admin.site.register(Journal, JournalAdmin)
admin.site.register(Activity, ActivityAdmin)


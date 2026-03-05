
import { Journal, Category, ActivityItem } from './types';

export const journals: Journal[] = [
  {
    id: '1',
    slug: 'analisis-komunikasi-digital-2024',
    title: 'Transformasi Ekonomi Digital: Navigasi Kebijakan Pasca Pandemi',
    authors: ['Dr. Ahmad Hidayat', 'Maria Ulfa'],
    year: 2024,
    date_published: '2024-03-01T00:00:00Z',
    category: Category.ARTIKEL_POPULER,
    abstract: 'Laporan ini membedah bagaimana akselerasi digital selama pandemi telah menciptakan struktur ekonomi baru yang memerlukan regulasi adaptif untuk melindungi sektor UMKM lokal.',
    cover_image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=400',
    pdf_url: 'https://scholar.google.com/example-source',
    hide_pdf_preview: true,
    content: {
      introduction: '<p>Pasca pandemi COVID-19, Indonesia mengalami lonjakan adopsi teknologi digital yang belum pernah terjadi sebelumnya. Namun, pertumbuhan ini menyisakan celah regulasi yang signifikan, terutama bagi pelaku usaha mikro.</p><p>Artikel ini mengeksplorasi langkah-langkah strategis yang perlu diambil pemerintah untuk memastikan ekosistem digital yang inklusif.</p>',
      sections: [],
      conclusion: '<p>Kesimpulannya, navigasi kebijakan harus berfokus pada penguatan infrastruktur digital di daerah tertinggal dan penyederhanaan birokrasi bagi UMKM digital.</p>'
    }
  },
  {
    id: '3',
    slug: 'dokumenter-suara-pesisir',
    title: 'Suara Pesisir: Perjuangan Masyarakat Adat Menghadapi Krisis Iklim',
    authors: ['Yusuf Maulana', 'Siti Aminah'],
    year: 2024,
    date_published: '2024-02-15T00:00:00Z',
    category: Category.DOKUMENTER,
    abstract: 'Investigasi lapangan mengenai ancaman abrasi dan tenggelamnya desa-desa pesisir utara Jawa akibat perubahan iklim yang ekstrem dalam lima tahun terakhir.',
    background_story: 'Latar belakang dokumenter ini berawal dari kegelisahan peneliti kami terhadap hilangnya peta daratan di beberapa titik kritis pantai utara Jawa. Kami menemukan bahwa solusi teknokratis seringkali mengabaikan kearifan lokal dalam mitigasi bencana. Film ini mencoba menangkap resonansi kesedihan sekaligus ketangguhan warga yang menolak menyerah pada ombak.',
    full_content: 'Dokumenter mendalam tentang bagaimana nelayan tradisional beradaptasi dengan perubahan iklim yang memaksa mereka bermigrasi atau kehilangan mata pencaharian utama mereka. Kami mengikuti perjalanan tiga keluarga di pesisir Demak yang rumahnya kini terendam air laut setiap kali pasang tiba. Dokumenter ini memotret kegagalan infrastruktur pencegah banjir dan bagaimana komunitas lokal beradaptasi secara mandiri.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
    full_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    cover_image: 'https://images.unsplash.com/photo-1496200186974-4293800e2c20?auto=format&fit=crop&q=80&w=800',
    key_findings: [
      'Kenaikan air laut rata-rata 10-15cm per tahun di area terdampak.',
      'Hilangnya mata pencaharian utama sebagai nelayan tradisional.',
      'Minimnya relokasi yang layak bagi warga terdampak abrasi.'
    ]
  },
  {
    id: '2',
    slug: 'independensi-media-global',
    title: 'Kedaulatan Informasi: Tantangan Media Lokal Menghadapi Big Tech',
    subtitle: 'Studi Kasus Dominasi Platform Digital di Indonesia 2020-2024',
    authors: [
      {
        name: 'Dr. Ahmad Hidayat',
        credentials: 'Ph.D in Media Studies',
        affiliation: 'Center for Economic and Law Studies (CELIOS)'
      },
      {
        name: 'Maria Ulfa',
        credentials: 'M.Si',
        affiliation: 'Universitas Indonesia'
      }
    ],
    year: 2024,
    date_published: '2024-03-10T00:00:00Z',
    category: Category.JURNAL,
    abstract: 'Mengkaji dominasi platform global terhadap distribusi konten berita di Indonesia dan dampaknya terhadap keberlangsungan model bisnis media massa arus utama. Penelitian ini menggunakan pendekatan kualitatif dengan wawancara mendalam terhadap 15 pemimpin redaksi media nasional dan lokal.',
    tags: ['Media', 'Big Tech', 'Ekonomi Digital', 'Kebijakan Publik'],
    reading_time: '12 min read',
    doi: '10.5678/corpus.v2i1.002',
    pdf_url: '#',
    download_url: '#',
    cover_image: 'https://images.unsplash.com/photo-1585829365234-781fcd50c8ef?auto=format&fit=crop&q=80&w=400',
    content: {
      introduction: '<p>Dominasi platform digital global seperti Google dan Meta telah mengubah lanskap distribusi informasi secara fundamental. Di Indonesia, lebih dari 70% trafik berita berasal dari platform pihak ketiga, yang menciptakan ketergantungan kritis bagi media lokal.</p><p>Pendahuluan ini mengeksplorasi bagaimana algoritma platform menentukan visibilitas konten dan bagaimana hal ini mempengaruhi independensi editorial.</p>',
      sections: [
        {
          id: 'methodology',
          title: 'Metodologi Penelitian',
          content: '<p>Penelitian ini menggunakan metode studi kasus deskriptif dengan pendekatan kualitatif. Data dikumpulkan melalui wawancara semi-terstruktur dan analisis dokumen kebijakan.</p>',
          subsections: [
            {
              id: 'data-collection',
              title: 'Pengumpulan Data',
              content: '<p>Wawancara dilakukan selama periode Januari hingga Desember 2023 dengan responden dari berbagai latar belakang industri media.</p>'
            }
          ]
        },
        {
          id: 'findings',
          title: 'Temuan Utama',
          content: '<p>Kami menemukan bahwa model bisnis media tradisional sedang berada di titik nadir akibat pergeseran belanja iklan ke platform digital.</p>',
          subsections: [
            {
              id: 'revenue-gap',
              title: 'Kesenjangan Pendapatan',
              content: '<p>Data menunjukkan penurunan pendapatan iklan cetak sebesar 45% dalam tiga tahun terakhir, sementara pendapatan digital tidak mampu menutupi selisih tersebut.</p>'
            }
          ]
        }
      ],
      conclusion: '<p>Diperlukan regulasi yang kuat seperti Publisher Rights untuk memastikan adanya pembagian pendapatan yang adil antara platform digital dan penerbit berita lokal.</p>'
    },
    references: [
      'Smith, J. (2024). Documentary Research Methods. Academic Press.',
      'Brown, A. & Davis, C. (2023). Qualitative Analysis in Social Science.',
      'Hidayat, A. (2022). Ekonomi Politik Media di Indonesia.'
    ]
  },
  {
    id: '4',
    slug: 'buku-manajemen-komunikasi',
    title: 'Arsitektur Komunikasi Publik di Era Disrupsi Informasi',
    authors: ['Prof. Gunawan Adi'],
    year: 2023,
    date_published: '2023-11-20T00:00:00Z',
    category: Category.BUKU,
    abstract: 'Panduan strategis bagi praktisi hubungan masyarakat dalam mengelola reputasi institusi di tengah badai misinformasi dan polarisasi opini di media sosial.',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '5',
    slug: 'literasi-media-gen-z',
    title: 'Paradoks Informasi: Bagaimana Gen Z Memvalidasi Berita di Media Sosial',
    authors: ['Rina Wijaya'],
    year: 2024,
    date_published: '2024-01-05T00:00:00Z',
    category: Category.JURNAL,
    abstract: 'Riset perilaku konsumsi media pada generasi digital native yang cenderung lebih skeptis terhadap media formal namun rentan terhadap echo chambers.',
    cover_image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=400',
    pdf_url: 'https://example.com/source-jurnal',
    hide_pdf_preview: true,
    content: {
      introduction: '<p>Generasi Z tumbuh dalam ekosistem informasi yang sangat terfragmentasi. Meskipun mereka memiliki literasi digital yang tinggi secara teknis, kemampuan untuk memvalidasi kebenaran informasi di tengah banjir hoaks menjadi tantangan tersendiri.</p>',
      sections: [],
      conclusion: '<p>Pendidikan literasi media harus berfokus pada verifikasi sumber dan pemahaman algoritma, bukan sekadar penggunaan perangkat digital.</p>'
    }
  }
];

export const activities: ActivityItem[] = [
  {
    id: '1',
    title: 'Workshop Metodologi Riset Kuantitatif Tingkat Lanjut',
    slug: 'workshop-riset-2024',
    category: 'Education',
    date: '15 Maret 2024',
    author: 'Akademi Corpus',
    description: 'Pelatihan intensif bagi peneliti muda dalam mengolah big data sosial dengan bantuan alat analisis modern untuk kebijakan publik.',
    content: 'Isi lengkap berita...',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Diskusi Publik: Masa Depan Kedaulatan Digital Indonesia',
    slug: 'diskusi-digital-2024',
    category: 'Events',
    date: '10 Maret 2024',
    author: 'Admin News',
    description: 'Menghadirkan pakar hukum dan praktisi teknologi untuk membahas urgensi kedaulatan data nasional di tengah persaingan teknologi global.',
    content: 'Isi lengkap berita...',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    title: 'Peluncuran Laporan Tahunan Indeks Kebebasan Pers Digital',
    slug: 'launching-report-2024',
    category: 'Research',
    date: '20 Februari 2024',
    author: 'Tim Riset',
    description: 'Data terbaru mengenai berbagai hambatan hukum dan teknis yang dihadapi jurnalis independen di ruang siber Indonesia sepanjang tahun 2023.',
    content: 'Isi lengkap berita...',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
  }
];

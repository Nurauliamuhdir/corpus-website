
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="serif-heading text-5xl font-bold mb-6">Tentang Kami</h1>
        <p className="text-xl text-gray-500 font-light leading-relaxed">
          Dedikasi untuk transparansi data dan akurasi analisis kebijakan publik di Indonesia.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
        <p>
          <strong>Corpus</strong> adalah platform publikasi akademik independen yang didirikan 
          pada tahun 2022. Kami berfungsi sebagai wadah bagi para akademisi, peneliti, dan praktisi 
          untuk membagikan temuan mereka dalam format yang dapat diakses oleh khalayak luas, mulai dari 
          pejabat pemerintah hingga mahasiswa.
        </p>
        
        <h2 className="serif-heading text-3xl font-bold text-gray-900 pt-8">Visi Kami</h2>
        <p>
          Menjadi sumber referensi utama bagi analisis kebijakan berbasis bukti yang mendukung 
          pembangunan nasional yang berkelanjutan dan inklusif. Kami percaya bahwa keputusan besar 
          harus didasarkan pada data yang kuat dan argumen yang teruji.
        </p>

        <h2 className="serif-heading text-3xl font-bold text-gray-900 pt-8">Misi Kami</h2>
        <ul className="list-disc pl-6 space-y-4">
          <li>Menyediakan platform publikasi berkualitas tinggi dengan standar peninjauan yang ketat.</li>
          <li>Mendorong kolaborasi lintas disiplin ilmu untuk memecahkan masalah kompleks.</li>
          <li>Menjembatani kesenjangan antara riset akademik dan implementasi kebijakan di lapangan.</li>
          <li>Menyediakan akses informasi yang bebas dan transparan bagi seluruh lapisan masyarakat.</li>
        </ul>

        <div className="bg-gray-50 p-10 rounded-3xl mt-16">
          <h2 className="serif-heading text-2xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Integritas</h4>
              <p className="text-sm">Menjaga kejujuran intelektual dalam setiap baris analisis yang kami terbitkan.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Inovasi</h4>
              <p className="text-sm">Menerapkan metodologi terbaru untuk memberikan perspektif yang segar dan relevan.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Inklusivitas</h4>
              <p className="text-sm">Memastikan setiap suara dari wilayah pelosok terdengar melalui data.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Aksesibilitas</h4>
              <p className="text-sm">Menyajikan informasi dalam bahasa yang mudah dipahami tanpa mengurangi esensi ilmiah.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

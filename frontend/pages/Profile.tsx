
import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Target, 
  Eye, 
  Award, 
  Users, 
  BookOpen, 
  TrendingUp 
} from "lucide-react";

const stats = [
  { number: "500+", label: "Publikasi Jurnal" },
  { number: "50+", label: "Peneliti Aktif" },
  { number: "25+", label: "Partner Institusi" },
  { number: "15", label: "Tahun Pengalaman" }
];

const values = [
  {
    icon: Award,
    title: "Integritas Akademis",
    description: "Menjunjung tinggi standar etika dalam setiap proses penelitian dan publikasi untuk menjaga kepercayaan publik."
  },
  {
    icon: BookOpen,
    title: "Keunggulan Penelitian",
    description: "Berkomitmen pada kualitas riset yang mendalam, metodologis, dan memberikan kontribusi nyata bagi ilmu pengetahuan."
  },
  {
    icon: Users,
    title: "Kolaborasi",
    description: "Memfasilitasi pertukaran pengetahuan antar peneliti, institusi, dan masyarakat untuk dampak yang lebih luas."
  },
  {
    icon: TrendingUp,
    title: "Dampak Berkelanjutan",
    description: "Fokus pada penelitian yang memberikan solusi jangka panjang bagi tantangan komunikasi dan media di era digital."
  }
];

const leadership = [
  {
    name: "Dr. Sarah Anderson",
    role: "Chief Editor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&auto=format&fit=crop",
    linkedin: "#"
  },
  {
    name: "Prof. Michael Chen",
    role: "Director of Research",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&auto=format&fit=crop",
    linkedin: "#"
  },
  {
    name: "Dr. Amira Rahman",
    role: "Head of Editorial",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&auto=format&fit=crop",
    linkedin: "#"
  }
];

const Profile: React.FC = () => {
  return (
    <div className="bg-white font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Layer 1: Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900"></div>
        
        {/* Layer 2: Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Tentang Kami
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Platform publikasi penelitian independen yang mendedikasikan diri pada studi media, kebijakan digital, dan transformasi komunikasi di Indonesia.
          </p>
        </div>
      </section>

      {/* 2. PROFILE SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
                PROFIL KAMI
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
                Dedikasi untuk Penelitian Berkualitas
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Corpus didirikan sebagai respon terhadap kebutuhan akan platform publikasi yang independen, kritis, dan berbasis data di sektor komunikasi dan media digital.
                </p>
                <p>
                  Sejak tahun 2011, kami telah menjadi wadah bagi para peneliti, akademisi, dan praktisi untuk mendiseminasikan temuan mereka kepada publik yang lebih luas, menjembatani kesenjangan antara teori dan praktik.
                </p>
                <p>
                  Kami menerapkan standar peer-review yang ketat untuk memastikan setiap publikasi memiliki integritas akademis yang tinggi dan memberikan dampak nyata bagi kebijakan publik.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?w=800&h=1000&auto=format&fit=crop" 
                  alt="Research Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-red-600 text-white p-8 rounded-lg shadow-xl max-w-xs hidden sm:block">
                <p className="text-4xl font-bold mb-1">15+</p>
                <p className="text-sm text-red-100 leading-snug">
                  Tahun melayani komunitas akademik dan publik di Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-red-600 mb-2">{stat.number}</p>
                <p className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision Card */}
            <div className="bg-white p-10 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Menjadi pusat unggulan penelitian komunikasi dan media yang independen, terpercaya, dan memberikan dampak signifikan bagi keadilan informasi di era digital.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-10 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1 font-bold">•</span>
                  Mendorong riset berkualitas tinggi yang relevan dengan tantangan komunikasi kontemporer.
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1 font-bold">•</span>
                  Memfasilitasi diseminasi pengetahuan yang inklusif dan mudah diakses oleh publik.
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1 font-bold">•</span>
                  Membangun ekosistem kolaborasi antara akademisi, praktisi, dan pembuat kebijakan.
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1 font-bold">•</span>
                  Mengadvokasi kebijakan digital yang berkeadilan dan berpusat pada hak asasi manusia.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VALUES SECTION */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
              NILAI-NILAI KAMI
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Prinsip yang Kami Pegang
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white p-8 border border-gray-200 rounded-lg hover:border-red-600 transition-colors duration-300 group">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors duration-300">
                    <value.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
              KEPEMIMPINAN
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Tim Pemimpin Kami
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Dipimpin oleh para ahli yang berdedikasi tinggi dalam bidang komunikasi, media, dan kebijakan publik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, idx) => (
              <div key={idx} className="group">
                <div className="relative overflow-hidden rounded-lg mb-6 aspect-[3/4]">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Social Icon Button */}
                  <a 
                    href={leader.linkedin} 
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-red-600 font-medium">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA SECTION */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Mari Berkolaborasi</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Kami terbuka untuk kolaborasi riset, diseminasi pengetahuan, atau pertanyaan seputar kegiatan kami. Mari bersama membangun ekosistem informasi yang lebih baik.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a 
              href="mailto:info@penelitian.co.id" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              Email Kami
            </a>
            <a 
              href="tel:+622112345678" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Phone className="w-5 h-5" />
              Hubungi Kami
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-gray-800">
            <div className="text-center">
              <Mail className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <a href="mailto:info@penelitian.co.id" className="text-gray-200 hover:text-white transition-colors">info@penelitian.co.id</a>
            </div>
            <div className="text-center">
              <Phone className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Telepon</p>
              <a href="tel:+622112345678" className="text-gray-200 hover:text-white transition-colors">+62 21 1234 5678</a>
            </div>
            <div className="text-center">
              <MapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Lokasi</p>
              <p className="text-gray-200">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Profile;

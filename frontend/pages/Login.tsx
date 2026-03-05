
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi delay jaringan
    setTimeout(() => {
      // Kredensial default untuk demo
      if (email === 'admin@corpus.id' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Email atau password yang Anda masukkan salah.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl mx-auto flex items-center justify-center mb-6">
            <span className="text-white font-serif text-3xl font-bold">C</span>
          </div>
          <h1 className="serif-heading text-2xl font-bold">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-2">Masuk untuk mengelola konten Corpus</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="admin@corpus.id"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : 'Masuk Ke Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Demo Access</p>
            <p className="text-[10px] text-gray-500">Email: <span className="text-black font-bold">admin@corpus.id</span></p>
            <p className="text-[10px] text-gray-500">Pass: <span className="text-black font-bold">admin123</span></p>
          </div>
          <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-black transition-colors">
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

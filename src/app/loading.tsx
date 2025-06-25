export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-[#101c2c] to-slate-950 min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-emerald-500 rounded-full animate-ping opacity-50" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute inset-4 border-4 border-emerald-500 rounded-full animate-ping opacity-25" style={{animationDelay: '0.6s'}}></div>
        </div>
        
        <p className="text-white text-xl font-semibold tracking-wide">Loading...</p>
      </div>
    </div>
  );
}
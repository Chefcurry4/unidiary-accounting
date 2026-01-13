export function GrainyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <svg className="absolute inset-0 h-full w-full opacity-30">
        <filter id="grainy-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy-texture)" />
      </svg>

      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#764ba2] blur-[120px] opacity-30 animate-float-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#667eea] blur-[140px] opacity-25 animate-float-delayed" />
      <div className="absolute bottom-[-5%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#43e97b] blur-[160px] opacity-20 animate-float-slow" />
      <div className="absolute bottom-[15%] right-[15%] w-[450px] h-[450px] rounded-full bg-[#fa709a] blur-[100px] opacity-25 animate-float-delayed" />
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-[#2980b9] blur-[130px] opacity-20 animate-float-slow" />

      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, 25px) scale(0.95);
          }
          66% {
            transform: translate(25px, -15px) scale(1.05);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

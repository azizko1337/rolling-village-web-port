export function CoffeeMug() {
  return (
    <div className="absolute top-10 right-20 z-10 transform rotate-12">
      <div className="coffee-stain"></div>
      <div className="coffee-mug">
        <div className="coffee-inner"></div>
      </div>
    </div>
  );
}

export function Ruler() {
  return (
    <div className="absolute bottom-5 left-5 w-[450px] h-20 bg-yellow-600 shadow-xl transform -rotate-6 rounded border border-yellow-700 flex flex-col justify-end overflow-hidden z-20">
      <div className="w-full h-full flex items-end justify-between px-4 pb-1 text-sm font-mono text-black">
        <div className="ruler-ticks">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-px bg-black ${i % 5 === 0 ? 'h-8' : 'h-4'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Pencil1() {
  return (
    <svg 
      className="pencil-decoration absolute top-10 left-20 transform rotate-[120deg]" 
      width="250" 
      height="30" 
      viewBox="0 0 300 40"
    >
      <rect x="0" y="5" width="30" height="30" fill="#E91E63" rx="2" />
      <rect x="30" y="5" width="15" height="30" fill="#B0BEC5" />
      <rect x="45" y="5" width="200" height="30" fill="#1976D2" />
      <rect x="45" y="12" width="200" height="16" fill="#1565C0" />
      <polygon points="245,5 245,35 280,20" fill="#FFCC80" />
      <polygon points="280,20 285,20" stroke="#000" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function Pencil2() {
  return (
    <svg 
      className="pencil-decoration absolute bottom-20 right-40 transform rotate-[-15deg]" 
      width="250" 
      height="30" 
      viewBox="0 0 300 40"
    >
      <rect x="0" y="5" width="30" height="30" fill="#F48FB1" rx="2" />
      <rect x="30" y="5" width="15" height="30" fill="#B0BEC5" />
      <rect x="45" y="5" width="200" height="30" fill="#FFC107" />
      <rect x="45" y="12" width="200" height="16" fill="#FFB300" />
      <polygon points="245,5 245,35 280,20" fill="#FFCC80" />
      <polygon points="280,20 285,20" stroke="#333" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function Compass() {
  return (
    <svg 
      className="compass-decoration absolute bottom-36 left-20 transform rotate-[15deg]" 
      width="180" 
      height="240" 
      viewBox="0 0 150 200"
    >
      <line x1="75" y1="20" x2="20" y2="180" stroke="#B0BEC5" strokeWidth="8" strokeLinecap="round" />
      <line x1="75" y1="20" x2="130" y2="180" stroke="#B0BEC5" strokeWidth="8" strokeLinecap="round" />
      <circle cx="75" cy="20" r="12" fill="#90A4AE" stroke="#78909C" strokeWidth="3" />
      <circle cx="75" cy="20" r="5" fill="#B0BEC5" />
      <rect x="70" y="5" width="10" height="15" fill="#90A4AE" rx="2" />
    </svg>
  );
}

export function Triangle() {
  return (
    <div className="absolute top-1/2 right-[-20px] w-64 h-64 border-l-[50px] border-b-[50px] border-transparent border-l-blue-200/40 border-b-blue-200/40 transform rotate-45 pointer-events-none"></div>
  );
}

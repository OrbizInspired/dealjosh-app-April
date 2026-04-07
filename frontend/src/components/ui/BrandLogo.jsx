export default function BrandLogo({ className = "h-20 w-20" }) {
  // SVG inspired exactly by image_3.png
  return (
    <svg 
      viewBox="0 0 100 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* The main Shopping Bag body (Yellow) */}
      <path d="M15 45 L85 45 C88 45, 90 47, 90 50 L85 110 C85 113, 83 115, 80 115 L20 115 C17 115, 15 113, 15 110 L10 50 C10 47, 12 45, 15 45 Z" fill="#FFD700" stroke="#CC5500" strokeWidth="1.5"/>
      
      {/* The Top Tent/Awning shape (Orange/Red) */}
      <path d="M10 50 L50 30 L90 50 Z" fill="#CC5500" stroke="#CC5500" strokeWidth="1.5"/>
      
      {/* The Rupee Symbol on the bag (Terracotta Red) */}
      <text x="50" y="90" fontSize="35" fontWeight="bold" fill="#FF4500" textAnchor="middle">₹</text>
      
      {/* The 'DJ' Tag (White background, Orange text) */}
      <rect x="35" y="48" width="30" height="20" rx="3" fill="white" stroke="#CC5500" strokeWidth="1"/>
      <text x="50" y="63" fontSize="14" fontWeight="bold" fill="#CC5500" textAnchor="middle">DJ</text>
      
      {/* The Top Handle (White line in the image, making it an orange arch for visibility) */}
      <path d="M40 30 Q50 10, 60 30" fill="none" stroke="#CC5500" strokeWidth="2"/>
    </svg>
  );
}
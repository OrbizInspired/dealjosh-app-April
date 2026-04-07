export default function Button({ children, onClick, variant = 'primary', isLoading, disabled }) {
  const baseStyle = "w-full py-3.5 rounded-xl font-bold text-lg transition-all flex justify-center items-center select-none active:scale-[0.98]";
  
  const variants = {
    // SWITCHED TO DJ ORANGE
    primary: "bg-dj-orange text-white hover:brightness-105 disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`} disabled={isDisabled}>
      {isLoading ? (
        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
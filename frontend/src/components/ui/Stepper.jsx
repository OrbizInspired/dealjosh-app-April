export default function Stepper({ currentStep, steps }) {
  const totalSteps = steps.length;
  const currentTitle = steps[currentStep - 1]?.title || '';

  return (
    <div className="mt-8 mb-6 px-4">
      {/* Dynamic Title Row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-dj-orange uppercase tracking-widest">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-bold text-gray-500 italic">
          {currentTitle}
        </span>
      </div>
      
      {/* Dynamic Progress Math */}
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-dj-yellow h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
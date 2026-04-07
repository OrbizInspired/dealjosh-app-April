import { Outlet } from 'react-router-dom';

export default function MerchantLayout() {
  return (
    // We removed 'p-4' on mobile so it touches the absolute edge, but kept it for desktop (sm:p-4)
    <div className="min-h-screen bg-dj-bg flex justify-center items-center sm:p-4">
      
      {/* MOBILE (Default): w-full, h-[100dvh], no borders, no rounded corners.
        DESKTOP (sm:): max-w-md, h-[85vh], rounded-[40px], border-8, shadow-2xl.
      */}
      <div className="w-full bg-white flex flex-col relative overflow-hidden px-8 py-10 h-dvh sm:max-w-md sm:h-[85vh] sm:rounded-[40px] sm:shadow-2xl sm:border-8 sm:border-gray-900">
        
        {/* The "Speaker" notch - We added 'hidden sm:block' so it only shows on the desktop simulator */}
        <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-200 rounded-full"></div>
        
        <Outlet />
      </div>
    </div>
  );
}
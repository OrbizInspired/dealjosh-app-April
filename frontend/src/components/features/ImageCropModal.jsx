import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCw, ZoomIn, Scissors } from 'lucide-react';

export default function ImageCropModal({ image, aspect, onCropComplete, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* THE WHITE CARD UI */}
      <div className="bg-white w-full rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* TOP: The Cropper Window */}
        <div className="relative h-72 w-full bg-slate-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* MIDDLE: The Custom Controls (Mockup Style) */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-around">
            {/* Zoom Slider */}
            <div className="flex flex-col items-center gap-2 flex-1 px-4">
              <ZoomIn size={18} className="text-slate-400" />
              <input 
                type="range" value={zoom} min={1} max={3} step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-dj-orange"
              />
            </div>
            
            {/* Rotation Button */}
            <button 
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RotateCw size={20} />
            </button>
          </div>

          {/* BOTTOM: Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onCancel}
              className="py-4 text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel Edit
            </button>
            <button 
              onClick={onConfirm}
              className="bg-dj-orange py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Apply Crop <Scissors size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
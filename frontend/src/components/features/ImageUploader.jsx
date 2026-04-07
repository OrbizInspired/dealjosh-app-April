import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { readFile, getCroppedImg } from '@/utils/imageUtils';
import { X, Camera, Loader2 } from 'lucide-react';
import ImageCropModal from './ImageCropModal'; // 👈 Import our new modular modal

export default function ImageUploader({ onUploadSuccess, initialPreview, label = "Upload", cropAspect = 1 }) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialPreview || null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(await readFile(file));
      setIsCropping(true);
      e.target.value = ''; 
    }
  };

  const handleCropConfirm = async () => {
    try {
      setIsCropping(false);
      setIsCompressing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 🗜️ Mandatory Compression (Max 200KB)
      const compressed = await imageCompression(croppedFile, { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true });
      
      const url = URL.createObjectURL(compressed);
      setImagePreview(url);
      onUploadSuccess(compressed, url);
    } catch (e) {
      alert("Error processing image.");
    } finally {
      setIsCompressing(false);
      setImageSrc(null);
    }
  };

  return (
    <div className="relative w-full h-full border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white transition-all group overflow-hidden">
      <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
      
      {isCompressing ? (
        <div className="flex flex-col items-center justify-center h-full text-dj-orange animate-pulse">
          <Loader2 className="animate-spin mb-1" size={20} />
          <span className="text-[9px] font-black uppercase">Crushing...</span>
        </div>
      ) : imagePreview ? (
        <div className="h-full w-full relative">
          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
          <button onClick={(e) => { e.preventDefault(); setImagePreview(null); onUploadSuccess(null, null); }} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full z-20"><X size={12} /></button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-2 opacity-40 group-hover:opacity-100">
          <Camera size={24} className="mb-1 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-500 uppercase">{label}</span>
        </div>
      )}

      {/* MODULAR MODAL CALL */}
      {isCropping && (
        <ImageCropModal 
          image={imageSrc} 
          aspect={cropAspect} 
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          onCancel={() => setIsCropping(false)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
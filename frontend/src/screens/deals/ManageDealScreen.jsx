// dealjosh-merchant/frontend/src/screens/deals/ManageDealScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Edit3, Zap, Clock, Eye,
    Download, Share2, LayoutGrid, PauseCircle, Trash2, Loader2
} from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

export default function ManageDealScreen() {
    const navigate = useNavigate();
    const { dealId } = useParams(); // 🚀 1. Grab the ID from the URL

    const [deal, setDeal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 🚀 2. Fetch the Deal Data from Go
    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deals/${dealId}`);
                if (!response.ok) throw new Error('Failed to fetch deal');

                const data = await response.json();
                setDeal(data);
            } catch (error) {
                console.error("Error loading deal:", error);
                alert("Could not load the deal details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (dealId) fetchDeal();
    }, [dealId]);

    const handleGoBack = () => navigate(-1);
    const handleDashboard = () => navigate('/dashboard');
    const handleCreateAnother = () => navigate('/create-deal');
    const handleAction = (actionName) => alert(`Triggering: ${actionName}`);

    // 🚀 Show a loading spinner while fetching from Go
    if (isLoading) {
        return (
            <div className="h-dvh flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
                <p className="text-slate-500 font-medium">Loading your deal...</p>
            </div>
        );
    }

    // 🚀 Safety check if deal wasn't found
    if (!deal) return <div className="p-8 text-center text-red-500">Deal not found.</div>;

    return (
        <div className="bg-slate-50 max-w-md mx-auto h-dvh flex flex-col shadow-2xl relative overflow-hidden">

            {/* 1. HEADER */}
            <div className="flex items-center px-4 py-4 bg-white border-b border-slate-100 shrink-0">
                <button onClick={handleGoBack} className="p-2 -ml-2 text-amber-500 hover:bg-amber-50 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-amber-500 ml-2">Manage Deal</h1>
            </div>

            {/* 2. SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">

                {/* Header Icon & Title */}
                <div className="text-center flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                                <Edit3 size={20} fill="currentColor" />
                            </div>
                        </div>
                        <Zap size={16} className="absolute -top-1 -right-2 text-amber-600 fill-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Management</h2>
                    <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">
                        Adjust your live offer settings to maximize customer engagement.
                    </p>
                </div>

                {/* Deal Preview Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="h-36 bg-slate-200 relative">
                        <img
                            src={deal.image_url || "https://images.unsplash.com/photo-1559525839-b184a4d698c7"}
                            alt={deal.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full uppercase">
                            {deal.status}
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                            <div className="w-8 h-8 bg-teal-800 rounded-lg border-2 border-white relative">
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold flex items-center gap-1 drop-shadow-md">
                                Brew & Beans Artisan Coffee <Edit3 size={12} />
                            </span>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{deal.title}</h3>
                        <div className="mt-3 space-y-1">
                            <p className="text-sm text-amber-600 font-semibold flex items-center gap-1.5">
                                <Clock size={14} /> Ends in 1 day 3 hrs 30 mins
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                Valid until {deal.end_date} • <span className="text-amber-600 underline font-medium cursor-pointer">Extend Time</span>
                            </p>
                        </div>
                        <div className="mt-4 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-2">
                            <Eye size={16} /> Estimating 1.2k+ views in first 24h
                        </div>
                    </div>
                </div>

                {/* ... (Share Section and Buttons remain exactly the same) ... */}
                {/* Share Section */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Share Your Deal</h4>
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative mb-4 p-2">
                            <div className="w-full h-full border-4 border-slate-200 border-dashed rounded-lg opacity-50 flex items-center justify-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg"></div>
                            </div>
                            <div className="absolute bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                                PROMO QR
                            </div>
                        </div>
                        <button onClick={() => handleAction('Download QR')} className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Download size={18} /> Download Promo QR
                        </button>
                    </div>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-3">
                    <button onClick={() => handleAction('Share Link')} className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <Share2 size={18} /> Share Link
                    </button>
                    <button onClick={handleDashboard} className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <LayoutGrid size={18} /> Back to Dashboard
                    </button>
                </div>

                {/* Danger/Secondary Actions */}
                <div className="flex gap-3">
                    <button onClick={() => handleAction('Pause Deal')} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                        <PauseCircle size={16} /> Pause Deal
                    </button>
                    <button onClick={() => handleAction('Cancel Deal')} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                        <Trash2 size={16} /> Cancel Deal
                    </button>
                </div>

                {/* Footer Link */}
                <div className="text-center pt-2">
                    <button onClick={handleCreateAnother} className="text-slate-600 font-semibold text-sm underline decoration-slate-300 underline-offset-4">
                        Create Another Deal
                    </button>
                </div>

            </div>

            <BottomNav />
        </div>
    );
}
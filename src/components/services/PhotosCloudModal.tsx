import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  HardDrive,
  Cloud,
  CheckCircle2,
  Upload,
  RefreshCw,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PhotoItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  url: string;
  size: string;
}

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'p-1',
    title: 'Journée Plage Assinie',
    date: 'Aujourd’hui 11:20',
    tag: 'Vacances',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    size: '3.4 Mo',
  },
  {
    id: 'p-2',
    title: 'Tech Summit Abidjan',
    date: 'Hier 16:45',
    tag: 'Tech',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    size: '4.1 Mo',
  },
  {
    id: 'p-3',
    title: 'Famille Réunion Cocody',
    date: '08 Oct 2026',
    tag: 'Famille',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    size: '2.8 Mo',
  },
  {
    id: 'p-4',
    title: 'Reçu Rechargement Kotani Pay',
    date: '05 Oct 2026',
    tag: 'Reçus',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    size: '1.2 Mo',
  },
  {
    id: 'p-5',
    title: 'Tourisme Plateau & Lagune',
    date: '01 Oct 2026',
    tag: 'Voyages',
    url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
    size: '5.0 Mo',
  },
  {
    id: 'p-6',
    title: 'Projet Design Super-App 85',
    date: '28 Sep 2026',
    tag: 'Travail',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    size: '6.2 Mo',
  },
];

interface PhotosCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotosCloudModal: React.FC<PhotosCloudModalProps> = ({ isOpen, onClose }) => {
  const { user, showToast } = useApp();

  const [activeService, setActiveService] = useState<'photos' | 'drive'>('photos');
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photosList, setPhotosList] = useState<PhotoItem[]>(INITIAL_PHOTOS);

  if (!isOpen) return null;

  const connectedEmail = user?.email || 'moncompte@gmail.com';

  const handleUploadSimulated = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newPhoto: PhotoItem = {
        id: `p-${Date.now()}`,
        title: `Photo synchronisée 85 #${photosList.length + 1}`,
        date: 'À l’instant',
        tag: 'Mobile',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        size: '3.1 Mo',
      };
      setPhotosList([newPhoto, ...photosList]);
      setIsUploading(false);
      showToast(`Photo sauvegardée sur ${activeService === 'photos' ? 'Google Photos' : 'Google Drive'} !`);
    }, 900);
  };

  const filteredPhotos = selectedTag === 'Tous'
    ? photosList
    : photosList.filter((p) => p.tag === selectedTag);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B35]">
              {activeService === 'photos' ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <HardDrive className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight">
                {activeService === 'photos' ? 'Google Photos' : 'Google Drive'}
              </h3>
              <p className="text-[11px] text-gray-500">
                Synchronisation automatique de vos médias
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cloud Service Selector Tabs */}
        <div className="p-3 bg-gray-50/80 border-b border-gray-100 shrink-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/60 rounded-2xl">
            <button
              onClick={() => setActiveService('photos')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeService === 'photos'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-rose-500" />
              <span>Google Photos</span>
            </button>

            <button
              onClick={() => setActiveService('drive')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeService === 'drive'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Google Drive</span>
            </button>
          </div>

          {/* Account status badge & Quota */}
          <div className="mt-3 p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-bold text-gray-900 block text-[11px]">
                  {isConfigured ? connectedEmail : 'Non connecté'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {isConfigured ? '4,8 Go utilisés sur 15 Go (Cloud actif)' : 'Veuillez connecter votre compte'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsConfigured(!isConfigured);
                showToast(
                  !isConfigured
                    ? `${activeService === 'photos' ? 'Google Photos' : 'Google Drive'} configuré avec succès !`
                    : 'Déconnexion du cloud effectuée'
                );
              }}
              className="text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer"
            >
              {isConfigured ? 'Changer' : 'Configurer'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isConfigured ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto">
                <Cloud className="w-7 h-7" />
              </div>
              <h4 className="font-black text-gray-900 text-sm">
                Connectez votre compte {activeService === 'photos' ? 'Google Photos' : 'Google Drive'}
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Accédez à tous vos albums, sauvegardez vos justificatifs de transactions et vos souvenirs directement depuis 85.
              </p>
              <button
                onClick={() => {
                  setIsConfigured(true);
                  showToast('Compte Google synchronisé avec succès !');
                }}
                className="py-3 px-6 rounded-2xl bg-[#FF6B35] text-white font-extrabold text-xs shadow-md hover:bg-[#E85520] transition cursor-pointer"
              >
                Autoriser la synchronisation
              </button>
            </div>
          ) : (
            <>
              {/* Actions & Filters */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {['Tous', 'Vacances', 'Tech', 'Famille', 'Reçus'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-[#FF6B35] text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleUploadSimulated}
                  disabled={isUploading}
                  className="py-1.5 px-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer disabled:bg-gray-300"
                >
                  <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span>{isUploading ? 'Envoi...' : 'Ajouter'}</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setPreviewPhoto(photo)}
                    className="group relative rounded-2xl overflow-hidden border border-gray-100 aspect-square bg-gray-100 cursor-pointer shadow-2xs hover:shadow-md transition"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-[10px] font-bold truncate block">{photo.title}</span>
                      <div className="flex items-center justify-between text-[8px] text-gray-300 mt-0.5">
                        <span>{photo.date}</span>
                        <span className="px-1 py-0.5 rounded bg-white/20 backdrop-blur-xs font-semibold">
                          {photo.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Full photo preview modal */}
        {previewPhoto && (
          <div className="fixed inset-0 z-60 bg-black/90 flex flex-col justify-between p-4 animate-fade-in">
            <div className="flex items-center justify-between text-white">
              <span className="font-bold text-sm truncate">{previewPhoto.title}</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-2 rounded-full bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-white text-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-300 block">Date & Stockage</span>
                <span className="font-semibold">{previewPhoto.date} • {previewPhoto.size}</span>
              </div>
              <button
                onClick={() => {
                  showToast('Lien de partage cloud copié !');
                  setPreviewPhoto(null);
                }}
                className="py-2 px-3 rounded-xl bg-[#FF6B35] font-extrabold text-xs"
              >
                Partager
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, FC, SetStateAction } from 'react';
import { Point, Area } from 'react-easy-crop';
import { AspectRatio } from '../ImageCrop';

interface SelectedImagesProps {
  getInitialCrop: () => Point;
  resetModal: () => void;
  imagensSelecionadas: File[];
  currentImageIndex: number;
  historyIndex: number;
  imageHistory: { image: File; crop: Point }[];
  setImagensSelecionadas: (valor: File[]) => void;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
  setImage: Dispatch<SetStateAction<string | null>>;
  setCrop: Dispatch<SetStateAction<Point>>;
  setCompletedCrop: Dispatch<React.SetStateAction<Area | null>>;
  setZoom: Dispatch<SetStateAction<number>>;
  setImageHistory: Dispatch<SetStateAction<{ image: File; crop: Point }[]>>;
  setHistoryIndex: Dispatch<SetStateAction<number>>;
  aspect: AspectRatio;
}

const SelectedImages: FC<SelectedImagesProps> = ({
  getInitialCrop,
  resetModal,
  imagensSelecionadas,
  currentImageIndex,
  historyIndex,
  imageHistory,
  setImagensSelecionadas,
  setCurrentImageIndex,
  setImage,
  setCrop,
  setCompletedCrop,
  setZoom,
  setImageHistory,
  setHistoryIndex,
}) => {
  return (
    <div className="bg-white border border-samu-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-samu-border pb-3">
        <h4 className="text-sm font-semibold text-samu-text">Fila de Imagens</h4>
        <button
          className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center gap-1.5"
          onClick={resetModal}
          title="Limpar tudo e voltar ao início"
        >
          <FontAwesomeIcon icon={faXmark} />
          Limpar Fila
        </button>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {imagensSelecionadas.map((img, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300 border ${
              index === currentImageIndex 
                ? 'bg-samu-primary-lighter/40 border-samu-primary/30' 
                : 'bg-transparent border-transparent hover:bg-samu-bg hover:border-samu-border/50'
            }`}
            onClick={() => {
              if (historyIndex >= 0 && imageHistory.length > 0) {
                const currentEditedImage = imageHistory[historyIndex].image;
                const newImages = [...imagensSelecionadas];
                newImages[currentImageIndex] = currentEditedImage;
                setImagensSelecionadas(newImages);
              }

              setCurrentImageIndex(index);
              setImage(URL.createObjectURL(img));
              setCrop(getInitialCrop());
              setCompletedCrop(null);
              setZoom(100);

              setImageHistory([{ image: img, crop: getInitialCrop() }]);
              setHistoryIndex(0);
            }}
          >
            <div className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 border ${index === currentImageIndex ? 'border-samu-primary' : 'border-samu-border'}`}>
              <img src={URL.createObjectURL(img)} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${index === currentImageIndex ? 'text-samu-primary-dark' : 'text-samu-text'}`}>
                {img.name}
              </p>
              <p className="text-[11px] text-samu-neutral mt-0.5">{(img.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedImages;
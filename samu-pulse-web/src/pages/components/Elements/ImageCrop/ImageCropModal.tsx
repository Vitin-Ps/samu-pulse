import React, {FC} from 'react';
import ImageCrop, {ImageCropProps} from './ImageCrop';

interface ImageCropModalProps extends ImageCropProps {
  isOpen: boolean;
}

export const ImageCropModal: FC<ImageCropModalProps> = ({
  limit,
  imagensSelecionadas,
  aspect,
  isOpen,
  mandatoryAspect,
  setImagensSelecionadas,
  onSave,
  onClose,
}) => {
  const handleSave = (arquivos: File[]) => {
    onSave && onSave(arquivos);
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:px-10">
      {/* 
        Ajustei o max-w para max-w-5xl, garantindo que o modal 
        não quebre o layout ficando largo demais nas telas maiores 
      */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl relative overflow-auto max-h-[95vh] border border-samu-border/50">
        <ImageCrop
          limit={limit}
          imagensSelecionadas={imagensSelecionadas}
          aspect={aspect}
          mandatoryAspect={mandatoryAspect}
          setImagensSelecionadas={setImagensSelecionadas}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
};


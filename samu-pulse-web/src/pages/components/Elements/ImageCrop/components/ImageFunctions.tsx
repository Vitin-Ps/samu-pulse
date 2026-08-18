import {faCheck, faRedo, faUndo, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC} from 'react';
import { truncateFileName } from '../../../../../services/Extra/FuncionalidadesService';

interface ImageFunctionsProps {
  imagensSelecionadas: File[];
  currentImageIndex: number;
  historyIndex: number;
  imageHistory: {image: File; crop: any}[];
  deleteCurrentImage: () => void;
  undo: () => void;
  redo: () => void;
  handleCrop: () => void;
  image: string | null;
}

const ImageFunctions: FC<ImageFunctionsProps> = ({
  imagensSelecionadas,
  currentImageIndex,
  historyIndex,
  imageHistory,
  deleteCurrentImage,
  undo,
  redo,
  handleCrop,
  image,
}) => {
  return (
    <div className="bg-white border border-samu-border rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-samu-bg border border-samu-border/50 flex items-center justify-center overflow-hidden shrink-0">
          <img src={image!} alt="Miniatura" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-samu-text">
            {truncateFileName(imagensSelecionadas[currentImageIndex]?.name || '')}
          </p>
          <p className="text-xs text-samu-neutral">
            {currentImageIndex + 1} de {imagensSelecionadas.length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 flex items-center gap-2"
          onClick={deleteCurrentImage}
          title="Excluir imagem atual">
          <FontAwesomeIcon icon={faXmark} />
          <span className="hidden sm:inline">Excluir</span>
        </button>

        <div className="w-px h-6 bg-samu-border mx-1"></div>

        <button
          className="text-samu-neutral hover:bg-samu-bg hover:text-samu-text transition-all duration-300 flex items-center justify-center w-9 h-9 cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Desfazer edição">
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          className="text-samu-neutral hover:bg-samu-bg hover:text-samu-text transition-all duration-300 flex items-center justify-center w-9 h-9 cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={redo}
          disabled={historyIndex >= imageHistory.length - 1}
          title="Refazer edição">
          <FontAwesomeIcon icon={faRedo} />
        </button>

        <div className="w-px h-6 bg-samu-border mx-1"></div>

        <button
          className="px-4 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 shadow-sm shadow-green-500/30 flex items-center gap-2"
          onClick={handleCrop}>
          <FontAwesomeIcon icon={faCheck} />
          <span>Cortar</span>
        </button>
      </div>
    </div>
  );
};

export default ImageFunctions;

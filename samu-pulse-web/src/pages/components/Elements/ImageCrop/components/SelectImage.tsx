import {faCloudArrowUp, faFolderOpen, faImage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC, FormEvent, useState} from 'react';

interface SelectImageProps {
  acionarInputFile: (e: FormEvent<HTMLButtonElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  addFile: () => void;
  handleCancel: () => void;
  limit: number;
  imagensSelecionadas: File[];
  onFilesDropped: (files: File[]) => void;
  aspect: string;
  mandatoryAspect: boolean;
}

const SelectImage: FC<SelectImageProps> = ({
  acionarInputFile,
  fileInputRef,
  addFile,
  handleCancel,
  aspect,
  mandatoryAspect,
  onFilesDropped,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/'),
    );
    if (files.length > 0) onFilesDropped(files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
        isDragOver
          ? 'border-samu-primary bg-samu-primary-lighter/30'
          : 'border-samu-border bg-samu-bg/30 hover:bg-samu-bg/70'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-samu-primary-lighter/50 flex items-center justify-center mb-6 shadow-sm text-samu-primary">
          <FontAwesomeIcon icon={faCloudArrowUp} className="text-4xl" />
        </div>
        <h3 className="text-lg font-semibold text-samu-text mb-2">
          Arraste sua imagem aqui
        </h3>
        <p className="text-sm text-samu-neutral mb-8">
          ou clique no botão abaixo para selecionar do computador
        </p>

        <button
          className="px-8 py-3 bg-samu-primary text-white font-medium rounded-xl hover:bg-samu-primary-dark transition-all duration-300 shadow-md shadow-samu-primary/30 flex items-center gap-2"
          onClick={(e: FormEvent<HTMLButtonElement>) => acionarInputFile(e)}>
          <FontAwesomeIcon icon={faFolderOpen} />
          Selecionar Imagem
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple={true}
          accept="image/*"
          style={{display: 'none'}}
          onChange={addFile}
        />

        <p className="text-xs text-samu-neutral mt-6">
          Formatos aceitos: JPG, PNG, WebP (Máx: 10MB)
        </p>

        {mandatoryAspect && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-samu-border shadow-sm w-full max-w-sm">
            <p className="text-xs font-semibold text-samu-text mb-3 uppercase tracking-wider">
              Proporção Obrigatória
            </p>
            <div className="flex items-center gap-4">
              <div
                className="bg-samu-bg border border-samu-border rounded-lg flex items-center justify-center text-samu-neutral"
                style={{
                  width:
                    aspect === '16:9' ? '120px' : aspect === '1:1' ? '80px' : '100px',
                  height:
                    aspect === '16:9' ? '67px' : aspect === '1:1' ? '80px' : '70px',
                }}>
                <FontAwesomeIcon icon={faImage} className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-samu-text">
                  {aspect === '16:9' && 'Banner (16:9)'}
                  {aspect === '1:1' && 'Quadrado (1:1)'}
                  {aspect === 'free' && 'Livre'}
                </p>
                <p className="text-xs text-samu-neutral mt-1">
                  {aspect === '16:9' && 'Recomendado: 1920x1080px'}
                  {aspect === '1:1' && 'Recomendado: 1000x1000px'}
                  {aspect === 'free' && 'Sem restrições'}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          className="text-sm font-medium text-samu-neutral hover:text-samu-text px-4 py-2 mt-6 transition-colors rounded-lg hover:bg-samu-border/30"
          onClick={handleCancel}>
          Cancelar e fechar
        </button>
      </div>
    </div>
  );
};

export default SelectImage;

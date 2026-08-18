import {FC, FormEvent, useRef, useState, useCallback} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faSquare,
  faCropSimple,
  faRectangleXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Cropper, {Point, Area} from 'react-easy-crop';
import SelectImage from './components/SelectImage';
import SelectedImages from './components/SelectedImages';
import ImageFunctions from './components/ImageFunctions';
import ZoomTolltip from './components/ZoomTolltip';
import {MessageService} from '../../../../services';

export interface ImageCropProps {
  limit?: number;
  imagensSelecionadas: File[];
  setImagensSelecionadas: (valor: File[]) => void;
  onSave?: (arquivos: File[]) => void;
  onClose?: () => void;
  aspect?: AspectRatio;
  mandatoryAspect?: boolean;
  changeZoom?: number;
}

export enum AspectRatio {
  BANNER = '16:9',
  SQUARE = '1:1',
  FREE = 'free',
}

const ImageCrop: FC<ImageCropProps> = ({
  limit = 1,
  imagensSelecionadas = [],
  setImagensSelecionadas,
  onSave,
  onClose,
  aspect: initialAspect = AspectRatio.BANNER,
  mandatoryAspect = false,
  changeZoom = 5,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [aspect, setAspect] = useState<AspectRatio>(initialAspect);

  const [crop, setCrop] = useState<Point>({x: 0, y: 0});
  const [zoom, setZoom] = useState<number>(100);
  const [completedCrop, setCompletedCrop] = useState<Area | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{image: File; crop: Point}>>(
    [],
  );
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const defaultHeigth = '480px'; // Aumentei um pouquinho pro crop ficar melhor
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectNumeric = (type: AspectRatio) => {
    if (type === '16:9') return 16 / 9;
    if (type === '1:1') return 1;
    return undefined;
  };

  const acionarInputFile = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFilesDropped = (files: File[]) => {
    if (files.length > limit) {
      MessageService.alertMessage(
        `Só é possível anexar ${limit} imagem${limit > 1 ? 's' : ''}!`,
      );
      return;
    }
    const novasImagens = files;
    setImagensSelecionadas(novasImagens);
    if (novasImagens.length > 0 && !image) {
      setCurrentImageIndex(0);
      setImage(URL.createObjectURL(novasImagens[0]));
      setCrop({x: 0, y: 0});
      setZoom(100);
      setImageHistory([{image: novasImagens[0], crop: {x: 0, y: 0}}]);
      setHistoryIndex(0);
    }
  };

  const addFile = () => {
    const inputFile: HTMLInputElement = fileInputRef.current!;
    if (inputFile.files && inputFile.files.length > 0) {
      const novosArquivos = Array.from(inputFile.files);
      if (novosArquivos.length > limit) {
        MessageService.alertMessage(
          `Só é possível anexar ${limit} imagem${limit > 1 ? 's' : ''}!`,
        );
        inputFile.value = '';
        return;
      }
      const novasImagens = novosArquivos;
      setImagensSelecionadas(novasImagens);
      if (novasImagens.length > 0 && !image) {
        setCurrentImageIndex(0);
        setImage(URL.createObjectURL(novasImagens[0]));
        setCrop({x: 0, y: 0});
        setZoom(100);
        setImageHistory([{image: novasImagens[0], crop: {x: 0, y: 0}}]);
        setHistoryIndex(0);
      }
    }
  };

  const onCropComplete = useCallback((_preventedArea: Area, pixels: Area) => {
    setCompletedCrop(pixels);
  }, []);

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const img = new Image();
    img.src = imageSrc;
    await new Promise(resolve => (img.onload = resolve));
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const handleCrop = async (): Promise<File[]> => {
    if (image && completedCrop) {
      const croppedBlob = await getCroppedImg(image, completedCrop);
      if (croppedBlob) {
        const croppedFile = new File(
          [croppedBlob],
          imagensSelecionadas[currentImageIndex].name,
          {type: 'image/jpeg'},
        );
        const newImages = [...imagensSelecionadas];
        newImages[currentImageIndex] = croppedFile;
        setImagensSelecionadas(newImages);
        setImage(URL.createObjectURL(croppedFile));

        const newHistory = imageHistory.slice(0, historyIndex + 1);
        newHistory.push({image: croppedFile, crop: crop});
        setImageHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setCrop({x: 0, y: 0});
        setCompletedCrop(null);
        setZoom(100);
        return newImages;
      }
    }
    return imagensSelecionadas;
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const historyItem = imageHistory[newIndex];
      const newImages = [...imagensSelecionadas];
      newImages[currentImageIndex] = historyItem.image;
      setImagensSelecionadas(newImages);
      setImage(URL.createObjectURL(historyItem.image));
      setCrop(historyItem.crop);
      setHistoryIndex(newIndex);
      setCompletedCrop(null);
      setZoom(100);
    }
  };

  const redo = () => {
    if (historyIndex < imageHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const historyItem = imageHistory[newIndex];
      const newImages = [...imagensSelecionadas];
      newImages[currentImageIndex] = historyItem.image;
      setImagensSelecionadas(newImages);
      setImage(URL.createObjectURL(historyItem.image));
      setCrop(historyItem.crop);
      setHistoryIndex(newIndex);
      setCompletedCrop(null);
      setZoom(100);
    }
  };

  const resetModal = () => {
    setImage(null);
    setCrop({x: 0, y: 0});
    setCompletedCrop(null);
    setCurrentImageIndex(0);
    setImgRef(null);
    setImagensSelecionadas([]);
    setImageHistory([]);
    setHistoryIndex(-1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteCurrentImage = () => {
    if (imagensSelecionadas.length === 0) return;
    const newImages = imagensSelecionadas.filter(
      (_, index) => index !== currentImageIndex,
    );
    setImagensSelecionadas(newImages);
    if (newImages.length === 0) {
      setImage(null);
      setCurrentImageIndex(0);
      setImageHistory([]);
      setHistoryIndex(-1);
    } else {
      const newIndex =
        currentImageIndex >= newImages.length
          ? newImages.length - 1
          : currentImageIndex;
      setCurrentImageIndex(newIndex);
      setImage(URL.createObjectURL(newImages[newIndex]));
      setCrop({x: 0, y: 0});
      setCompletedCrop(null);
      setZoom(100);
      setImageHistory([{image: newImages[newIndex], crop: {x: 0, y: 0}}]);
      setHistoryIndex(0);
    }
  };

  const handleOnSave = async () => {
    const newImages = await handleCrop();
    onSave?.(newImages);
  };

  const handleCancel = () => {
    resetModal();
    onClose?.();
  };

  return (
    <div className="p-8">
      {!image ? (
        <SelectImage
          acionarInputFile={acionarInputFile}
          fileInputRef={fileInputRef}
          addFile={addFile}
          handleCancel={handleCancel}
          limit={limit}
          imagensSelecionadas={imagensSelecionadas}
          onFilesDropped={onFilesDropped}
          aspect={aspect}
          mandatoryAspect={mandatoryAspect}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-samu-text mr-1">
                Proporção:
              </span>
              {!mandatoryAspect && (
                <>
                  <button
                    className={`px-4 py-2 border rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                      aspect === AspectRatio.BANNER
                        ? 'border-samu-primary bg-samu-primary-lighter/30 text-samu-primary'
                        : 'border-samu-border bg-white text-samu-neutral hover:border-samu-neutral'
                    }`}
                    onClick={() => setAspect(AspectRatio.BANNER)}>
                    <FontAwesomeIcon icon={faRectangleXmark} />
                    Banner (16:9)
                  </button>
                  <button
                    className={`px-4 py-2 border rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                      aspect === AspectRatio.SQUARE
                        ? 'border-samu-primary bg-samu-primary-lighter/30 text-samu-primary'
                        : 'border-samu-border bg-white text-samu-neutral hover:border-samu-neutral'
                    }`}
                    onClick={() => setAspect(AspectRatio.SQUARE)}>
                    <FontAwesomeIcon icon={faSquare} />
                    Quadrado (1:1)
                  </button>
                  <button
                    className={`px-4 py-2 border rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                      aspect === AspectRatio.FREE
                        ? 'border-samu-primary bg-samu-primary-lighter/30 text-samu-primary'
                        : 'border-samu-border bg-white text-samu-neutral hover:border-samu-neutral'
                    }`}
                    onClick={() => setAspect(AspectRatio.FREE)}>
                    <FontAwesomeIcon icon={faCropSimple} />
                    Livre
                  </button>
                </>
              )}

              {mandatoryAspect && (
                <span className="px-4 py-1.5 bg-samu-bg text-samu-primary font-bold text-sm rounded-lg border border-samu-border/50">
                  {aspect === '16:9' && 'Banner (16:9)'}
                  {aspect === '1:1' && 'Quadrado (1:1)'}
                  {aspect === 'free' && 'Livre'}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                className="text-sm font-medium text-samu-neutral px-5 py-2 rounded-xl hover:bg-samu-bg hover:text-samu-text transition-colors"
                onClick={handleCancel}>
                Cancelar
              </button>
              <button
                className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-samu-primary text-white hover:bg-samu-primary-dark transition-all duration-300 shadow-md shadow-samu-primary/30"
                onClick={handleOnSave}>
                <FontAwesomeIcon icon={faCheck} />
                Concluir
              </button>
            </div>
          </div>

          <div
            className="crop-container bg-gray-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-samu-border"
            style={{height: defaultHeigth}}>
            <Cropper
              image={image!}
              crop={crop}
              zoom={zoom / 100}
              aspect={getAspectNumeric(aspect)}
              onCropChange={setCrop}
              onZoomChange={newZoom => {
                if (newZoom * 100 > zoom) setZoom(Math.min(200, zoom + changeZoom));
                else setZoom(Math.max(50, zoom - changeZoom));
              }}
              onCropComplete={onCropComplete}
              objectFit="contain"
              minZoom={0.5}
            />
            <ZoomTolltip zoom={zoom} setZoom={setZoom} changeZoom={changeZoom} />
          </div>

          <ImageFunctions
            currentImageIndex={currentImageIndex}
            deleteCurrentImage={deleteCurrentImage}
            handleCrop={handleCrop}
            imagensSelecionadas={imagensSelecionadas}
            historyIndex={historyIndex}
            imageHistory={imageHistory}
            redo={redo}
            undo={undo}
            image={image!}
          />

          {imagensSelecionadas.length > 1 && (
            <SelectedImages
              currentImageIndex={currentImageIndex}
              getInitialCrop={() => ({x: 0, y: 0})}
              imagensSelecionadas={imagensSelecionadas}
              historyIndex={historyIndex}
              imageHistory={imageHistory}
              setImagensSelecionadas={setImagensSelecionadas}
              setCurrentImageIndex={setCurrentImageIndex}
              setImage={setImage}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              setZoom={setZoom}
              setImageHistory={setImageHistory}
              setHistoryIndex={setHistoryIndex}
              aspect={aspect}
              resetModal={resetModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCrop;

import {
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FC} from 'react';

interface ZoomTolltipProps {
  zoom: number;
  setZoom: (value: number) => void;
  changeZoom?: number;
}

const ZoomTolltip: FC<ZoomTolltipProps> = ({zoom, setZoom, changeZoom = 10}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-samu-text/90 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-4 shadow-xl border border-white/10 z-10">
      <button
        onClick={() => setZoom(Math.max(50, zoom - changeZoom))}
        className="text-white/70 hover:text-white transition-colors">
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
      </button>

      <input
        type="range"
        min="50"
        max="200"
        step={changeZoom}
        value={zoom}
        onChange={e => setZoom(Number(e.target.value))}
        // Substituída classe customizada pelo accent nativo do Tailwind que já formata bonito
        className="w-40 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-samu-primary"
      />

      <button
        onClick={() => setZoom(Math.min(200, zoom + changeZoom))}
        className="text-white/70 hover:text-white transition-colors">
        <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
      </button>
      <span className="text-white text-xs font-semibold w-9 text-right">{zoom}%</span>
    </div>
  );
};

export default ZoomTolltip;

import {FC, lazy, Suspense} from 'react';
import {useBodyScrollLock} from '../../../hooks/useBodyScrollLock';
import {useFunctionsProvider} from '../../../contexts';
import {Logo} from '../Logo';
import Spinner from '../Elements/Spinner';

const ProgressSpinner = lazy(() => import('../Elements/Progress/ProgressSpinner')
  .then(module => ({default: module.ProgressSpinner})));

interface LoadingProps {
  title?: string;
  text?: string;
}

export const Loading: FC<LoadingProps> = ({title, text}) => {
  const {loading, progress} = useFunctionsProvider();

  useBodyScrollLock(loading);

  if (!loading) return null;

  return (
    <div role="status" aria-live="polite" className="fixed top-0 left-0 w-screen h-screen z-9999 flex justify-center items-center bg-white/70 backdrop-blur-md">
      <div className="text-center flex flex-col items-center">
        <div className={`w-24 h-24 mb-6 flex items-center justify-center ${progress === null ? 'motion-safe:animate-pulse' : ''}`}>
          {progress !== null ? (
            <Suspense fallback={<Spinner />}>
              <ProgressSpinner progress={progress} size={80} />
            </Suspense>
          ) : (
            <Logo className="w-20 h-20 drop-shadow-md" alt="Carregando..." />
          )}
        </div>
        <h2 className="text-samu-text font-bold text-xl mb-2 motion-safe:animate-pulse">
          {title || 'Carregando...'}
        </h2>
        <p className="text-samu-text/70 text-sm max-w-62.5">
          {text || 'Aguarde enquanto processamos as informações'}
        </p>
      </div>
    </div>
  );
};

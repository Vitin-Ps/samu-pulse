import {useEffect, useState} from 'react';
import {useRegisterSW} from 'virtual:pwa-register/react';
import {Button} from './Elements/Button';

export const PwaStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const {needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker} = useRegisterSW();

  useEffect(() => {
    const connected = () => setOnline(true);
    const disconnected = () => setOnline(false);
    window.addEventListener('online', connected);
    window.addEventListener('offline', disconnected);
    return () => {
      window.removeEventListener('online', connected);
      window.removeEventListener('offline', disconnected);
    };
  }, []);

  if (online && !needRefresh) return null;

  const atualizar = async () => {
    setUpdating(true);
    setUpdateError(false);
    try {
      await updateServiceWorker(true);
    } catch {
      setUpdateError(true);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <aside role="status" aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-sm z-50 bg-white border border-samu-border rounded-2xl shadow-lg p-4 text-samu-text">
      {!online ? (
        <><p className="font-semibold">Você está sem conexão</p>
          <p className="text-sm mt-1">Conecte-se à internet para consultar ou salvar membros e mensagens.</p></>
      ) : (
        <><p className="font-semibold">Uma nova versão está disponível</p>
          <p className="text-sm mt-1">Salve suas alterações antes de atualizar o aplicativo.</p>
          {updateError && <p className="text-sm text-samu-danger mt-2">Não foi possível atualizar. Tente novamente.</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button type="button" onClick={atualizar} disabled={updating}>{updating ? 'Atualizando...' : 'Atualizar'}</Button>
            <Button type="button" variant="secondary" onClick={() => setNeedRefresh(false)} disabled={updating}>Agora não</Button>
          </div></>
      )}
    </aside>
  );
};

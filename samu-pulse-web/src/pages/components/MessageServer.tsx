import React, {useEffect, useState, useRef} from 'react';
import {
  faCheckCircle,
  faCircleInfo,
  faExclamationTriangle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MessageService} from '../../services';
import {ProgressBarAnimation} from './Elements/Progress/ProgressBarAnimation';

enum TypeConfirm {
  alert = 'Alerta',
  confirm = 'Confirmação',
  success = 'Sucesso',
  error = 'Erro',
}

export const MessageServer = () => {
  const [messageShow, setMessageShow] = useState<boolean>(false);
  const [typeConfirm, setTypeConfirm] = useState<TypeConfirm>(TypeConfirm.alert);
  const [isClosing, setIsClosing] = useState<boolean>(true);
  const secondsClose = 3000;
  const [message, setMessage] = useState<string>('');
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();

  const [paused, setPaused] = useState<boolean>(false);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(secondsClose);
  const pausedRef = useRef<boolean>(false);

  useEffect(() => {
    MessageService.setAlertHandler((msg: string) => {
      setMessage(msg);
      setTypeConfirm(TypeConfirm.alert);
      handleOpen();
      resetTimer();
    });

    MessageService.setSuccessHandler((msg: string) => {
      setMessage(msg);
      setTypeConfirm(TypeConfirm.success);
      handleOpen();
      resetTimer();
    });

    MessageService.setErrorHandler((msg: string) => {
      setMessage(msg);
      setTypeConfirm(TypeConfirm.error);
      handleOpen();
      resetTimer();
    });

    MessageService.setConfirmHandler((msg: string, onConfirmCallback: () => void) => {
      setMessage(msg);
      setTypeConfirm(TypeConfirm.confirm);
      setOnConfirm(() => onConfirmCallback);
      handleOpen();

      // confirm não fecha automaticamente
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      pausedRef.current = false;
      setPaused(false);
    });

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [secondsClose]);

  const resetTimer = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    remainingRef.current = secondsClose;
    pausedRef.current = false;
    setPaused(false);
    startTimer(secondsClose);
  };

  const startTimer = (duration: number) => {
    startTimeRef.current = Date.now();
    timeoutIdRef.current = setTimeout(() => {
      handleClose();
      startTimeRef.current = null;
    }, duration);
  };

  const clearTimeoutHandler = () => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const cancelarMessage = () => {
    clearTimeoutHandler();
    handleClose();
  };

  const handleClose = () => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    startTimeRef.current = null;
    pausedRef.current = false;

    setIsClosing(true);
    setTimeout(() => setMessageShow(false), 300); // Reduzi de 500ms para 300ms (fica mais ágil)
  };

  const handleOpen = () => {
    setMessageShow(true);
    setIsClosing(true);
    requestAnimationFrame(() => {
      setIsClosing(false);
    });
  };

  const title = typeConfirm;

  // Define os ícones e cores com base no tipo
  const icon =
    typeConfirm === TypeConfirm.confirm
      ? faExclamationTriangle
      : typeConfirm === TypeConfirm.success
        ? faCheckCircle
        : typeConfirm === TypeConfirm.error
          ? faTimesCircle
          : faCircleInfo;

  const iconColor =
    typeConfirm === TypeConfirm.confirm
      ? 'text-orange-500'
      : typeConfirm === TypeConfirm.success
        ? 'text-green-500'
        : typeConfirm === TypeConfirm.error
          ? 'text-red-500'
          : 'text-samu-primary';

  const progressColor =
    typeConfirm === TypeConfirm.success
      ? 'bg-green-500'
      : typeConfirm === TypeConfirm.error
        ? 'bg-red-500'
        : 'bg-samu-primary';

  if (!messageShow) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 px-4 ease-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}>
      <div
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 ease-out overflow-hidden border border-samu-border/50 ${
          isClosing
            ? 'scale-95 opacity-0 translate-y-4'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
        onMouseEnter={() => {
          if (typeConfirm === TypeConfirm.confirm) return;
          if (pausedRef.current) return;

          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
          }

          if (startTimeRef.current !== null) {
            const elapsed = Date.now() - startTimeRef.current;
            remainingRef.current = Math.max(0, remainingRef.current - elapsed);
          }

          pausedRef.current = true;
          setPaused(true);
        }}
        onMouseLeave={() => {
          if (typeConfirm === TypeConfirm.confirm) return;
          if (!pausedRef.current) return;

          pausedRef.current = false;
          setPaused(false);

          if (remainingRef.current > 0) {
            startTimer(remainingRef.current);
          } else {
            handleClose();
          }
        }}>
        <div className="relative w-full flex flex-col gap-5 px-6 py-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`text-5xl mb-2 ${iconColor}`}>
              <FontAwesomeIcon icon={icon} />
            </div>
            <h2 className="text-xl font-bold text-samu-text">{title}</h2>
            <p className="text-sm text-samu-text/80 text-center leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex w-full justify-center gap-4 mt-2">
            {typeConfirm === TypeConfirm.confirm ? (
              <>
                <button
                  onClick={cancelarMessage}
                  className="px-6 py-2.5 text-sm font-bold text-samu-text/80 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-samu-text transition-all duration-200">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    clearTimeoutHandler();
                    setMessageShow(false);
                    setIsClosing(true);
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-samu-primary rounded-lg hover:bg-samu-primary/90 shadow-md shadow-samu-primary/30 transition-all duration-200">
                  Confirmar
                </button>
              </>
            ) : (
              <button
                onClick={cancelarMessage}
                className="px-8 py-2.5 text-sm font-bold text-white bg-samu-primary rounded-lg hover:bg-samu-primary/90 shadow-md shadow-samu-primary/30 transition-all duration-200">
                OK
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso no Rodapé */}
        {typeConfirm !== TypeConfirm.confirm && (
          <div className="absolute bottom-0 left-0 w-full h-1.5 overflow-hidden bg-gray-100">
            <ProgressBarAnimation
              duration={secondsClose}
              paused={paused}
              carregar={false}
              corBarra={progressColor}
              corFundoBarra="bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
};

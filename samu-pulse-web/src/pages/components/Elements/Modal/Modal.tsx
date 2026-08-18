import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  showModal: boolean;
  showCloseModal?: boolean;
  setShowModal?: (valor: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  children,
  className,
  showCloseModal = true,
}) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
      setIsClosing(true);
      requestAnimationFrame(() => {
        setIsClosing(false);
      });
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }
  }, [showModal]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (setShowModal) {
        setShowModal(false);
      }
    }, 100);
  };

  return isVisible ? (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center bg-black/40 transition-opacity duration-300 px-4 ease-out  ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}>
      <div
        className={`bg-white w-full rounded-2xl shadow-2xl transform transition-all duration-300 ease-out overflow-hidden ${
          isClosing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        } ${className ? className : 'max-w-md '}`}>
        {showCloseModal && (
          <span
            className="fechar_modal absolute top-4 right-4 cursor-pointer"
            onClick={handleClose}>
            <FontAwesomeIcon icon={faX} />
          </span>
        )}
        {children}
      </div>
    </div>
  ) : null;
};

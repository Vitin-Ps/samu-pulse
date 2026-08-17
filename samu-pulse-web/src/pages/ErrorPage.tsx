import React from 'react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeartPulse, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-samu-bg flex flex-col items-center justify-center px-6 font-sans">
      {/* Ícone com tom acolhedor e o pulso da marca */}
      <div className="mb-6 text-samu-accent text-6xl opacity-30 animate-pulse">
        <FontAwesomeIcon icon={faHeartPulse} />
      </div>

      {/* Texto de Erro / Acolhimento Samu Pulse */}
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-black text-samu-text tracking-tighter">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-samu-text">
          Opa! Este registro está fora do nosso radar.
        </h2>
        <p className="text-samu-neutral max-w-md mx-auto text-lg leading-relaxed">
          Parece que a página que você tentou acessar não existe ou foi movida. Não se
          preocupe, vamos te guiar de volta ao painel principal de acompanhamento.
        </p>
      </div>

      {/* Botão de Ação usando o Azul Confiança (samu-primary) */}
      <button
        onClick={() => navigate('/')}
        className="mt-10 flex items-center gap-2 bg-samu-primary text-white px-8 py-3 rounded-2xl font-semibold hover:bg-samu-primary-dark transition-all duration-300 shadow-sm active:scale-95 cursor-pointer">
        <FontAwesomeIcon icon={faArrowLeft} />
        Voltar para o Início
      </button>

      {/* Detalhe sutil de design no rodapé usando samu-accent */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-samu-accent to-transparent opacity-30"></div>
    </div>
  );
};

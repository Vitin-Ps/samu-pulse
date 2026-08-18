import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faHeartPulse,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../Auth/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const handleLogout = () => {
    setIsMenuOpen(false);
    auth.signout();
    navigate('/auth/sign-in');
  };

  return (
    <header
      id="header"
      className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center top-0 left-0 right-0 ">
      <div
        className="flex items-center gap-3"
        onClick={() => navigate('/')}
        style={{cursor: 'pointer'}}>
        <div className="w-10 h-10 rounded-xl bg-samu-primary flex items-center justify-center text-white text-xl shadow-sm">
          <FontAwesomeIcon icon={faHeartPulse} />
        </div>
        <span className="text-xl font-semibold tracking-tight text-samu-text">
          Samu Pulse
        </span>
      </div>

      <div className="flex items-center gap-4 relative">
        <span className="text-samu-neutral font-medium hidden sm:block">
          Olá, Tudo bem?
        </span>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-11 h-11 rounded-full bg-samu-bg text-samu-primary border-2 border-white shadow-sm flex items-center justify-center hover:bg-samu-border/50 transition-colors cursor-pointer outline-none">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        </button>

        {isMenuOpen && (
          <div className="absolute top-14 right-0 w-36 bg-white border border-samu-border rounded-xl shadow-card z-50 overflow-hidden py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-samu-danger hover:bg-samu-bg transition-colors flex items-center gap-2 cursor-pointer">
              <FontAwesomeIcon icon={faRightFromBracket} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full text-center py-8 text-sm text-samu-neutral absolute bottom-0">
      <a
        href="#"
        className="hover:text-samu-primary transition-colors flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={faCircleQuestion} /> Precisa de ajuda com o sistema?
      </a>
    </footer>
  );
};

import {faHeartPulse} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useNavigate} from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

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

      <div className="flex items-center gap-4">
        <span className="text-samu-neutral font-medium hidden sm:block">
          Olá, Pastor Silva
        </span>
        <img
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
          alt="Profile"
          className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover"
        />
      </div>
    </header>
  );
};

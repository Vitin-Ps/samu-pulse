import React, {useState} from 'react';
import {FC} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faHeartPulse,
  faRightToBracket,
  faShieldHalved,
  faSpinner,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {faUser, faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import {useSignInModel} from './useSignInModel';
import {Button, Input} from '../components/Elements';

export const SignInView: FC<ReturnType<typeof useSignInModel>> = ({
  stateModel,
  signIn,
  loading,
}) => {
  return (
    <div className="fixed inset-0 z-30 bg-samu-bg min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-y-auto">
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true">
        <div
          className="absolute top-16 left-16 w-48 h-48 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #2587D7 0%, transparent 70%)',
          }}></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #48A999 0%, transparent 70%)',
          }}></div>
        <div
          className="absolute top-1/2 left-4 w-24 h-24 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #C4983A 0%, transparent 70%)',
          }}></div>
      </div>

      <main
        id="login-card"
        className="relative w-full max-w-md bg-white rounded-3xl border border-samu-border shadow-2xl px-8 py-10 sm:px-10 sm:py-12 my-auto">
        <section id="branding-section" className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-samu-border bg-liber-to-br from-[#2587D7]/10 to-[#48A999]/10">
            <FontAwesomeIcon
              icon={faHeartPulse}
              className="text-samu-primary text-2xl"
            />
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl tracking-tight text-samu-text font-bold">
              Samu
            </span>
            <span className="text-2xl tracking-tight text-samu-primary font-bold">
              Pulse
            </span>
          </div>

          <p className="text-sm text-samu-neutral text-center leading-relaxed mt-1">
            Entre com suas credenciais para continuar
          </p>
        </section>

        <div className="w-full h-px bg-samu-border mb-8"></div>

        <section id="form-section">
          <form id="login-form" onSubmit={signIn} noValidate>
            <Input
              id="login"
              type="login"
              label="LOGIN"
              placeholder="user-login"
              iconLeft={faUser}
              autoComplete="username"
              value={stateModel.data.login}
              onChange={e => stateModel.updateState('login', e.target.value)}
              required
            />

            <Input
              id="password"
              type={stateModel.data.senhaShow ? 'text' : 'password'}
              label="SENHA"
              placeholder="••••••••"
              iconLeft={faLock}
              iconRight={stateModel.data.senhaShow ? faEyeSlash : faEye}
              onIconRightClick={() =>
                stateModel.updateState('senhaShow', !stateModel.data.senhaShow)
              }
              value={stateModel.data.senha}
              onChange={e => stateModel.updateState('senha', e.target.value)}
              autoComplete="current-password"
              required
              className="mb-2!"
            />

            {/* <div className="flex justify-end mb-7">
              <a
                href="#forgot-password"
                onClick={e => e.preventDefault()}
                className="text-xs text-samu-primary hover:text-samu-accent transition-colors font-medium">
                Esqueceu a senha?
              </a>
            </div> */}

            <Button
              type="submit"
              disabled={loading}
              icon={loading ? faSpinner : faRightToBracket}
              className="w-full! h-12 disabled:opacity-75 mt-5">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </section>

        <footer
          id="card-footer"
          className="mt-8 pt-6 border-t border-samu-border flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="text-samu-success text-xs"
            />
            <span className="text-xs text-samu-neutral">Acesso protegido e seguro</span>
          </div>
          <p className="text-xs mt-1" style={{color: '#BDC8C7'}}>
            SAMU — Salvando mais um © 2025
          </p>
        </footer>
      </main>

      <p className="mt-6 text-xs text-samu-neutral opacity-60 text-center relative z-10">
        Acesso restrito a operadores autorizados
      </p>
    </div>
  );
};

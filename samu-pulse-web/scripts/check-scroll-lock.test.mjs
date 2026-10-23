import assert from 'node:assert/strict';
import {test} from 'node:test';
import {lockBodyScroll} from '../src/hooks/useBodyScrollLock.ts';

globalThis.document = {body: {style: {overflow: ''}}};

test('fechar o modal durante uma operação libera o scroll ao terminar o carregamento', () => {
  const closeModal = lockBodyScroll();
  const finishLoading = lockBodyScroll();
  closeModal();
  assert.equal(document.body.style.overflow, 'hidden');
  finishLoading();
  assert.equal(document.body.style.overflow, '');
});

test('falha mantém o modal bloqueando o fundo até fechar', () => {
  const closeModal = lockBodyScroll();
  const failLoading = lockBodyScroll();
  failLoading();
  assert.equal(document.body.style.overflow, 'hidden');
  closeModal();
  assert.equal(document.body.style.overflow, '');
});

test('desmontagem e limpeza repetida preservam o overflow original', () => {
  document.body.style.overflow = 'auto';
  const closeModal = lockBodyScroll();
  const finishLoading = lockBodyScroll();
  closeModal();
  closeModal();
  assert.equal(document.body.style.overflow, 'hidden');
  finishLoading();
  assert.equal(document.body.style.overflow, 'auto');
  document.body.style.overflow = '';
});

test('carregamento sem modal restaura o scroll', () => {
  const finishLoading = lockBodyScroll();
  assert.equal(document.body.style.overflow, 'hidden');
  finishLoading();
  assert.equal(document.body.style.overflow, '');
});

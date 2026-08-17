import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faHeartPulse,
  faUserPlus,
  faArrowLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Button, Input, TextArea} from '../components/Elements';

export const AddMemberView = () => {
  const navigate = useNavigate();

  return (
    <main className="grow flex items-start justify-center px-4 pb-16 pt-10 w-full">
      <div className="w-full max-w-150 bg-white rounded-3xl shadow-sm border border-samu-border overflow-hidden">
        {/* Header da Tela */}
        <div className="px-8 pt-8 pb-6 border-b border-samu-border">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-samu-neutral hover:text-samu-primary transition-colors text-sm font-medium cursor-pointer mb-5">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Voltar ao início
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-samu-text leading-tight">
                Novo Cadastro
              </h1>
              <p className="text-samu-neutral text-sm mt-1 font-medium flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faHeartPulse}
                  className="text-samu-primary opacity-80"
                />
                SAMU — Salvando mais um
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-samu-primary-lighter flex items-center justify-center text-samu-primary shrink-0">
              <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
            </div>
          </div>
        </div>

        {/* Formulário com Componentes Reutilizáveis */}
        <form className="px-8 py-8" onSubmit={e => e.preventDefault()}>
          <Input
            id="nome"
            label="Nome Completo"
            placeholder="Ex: Maria dos Santos Oliveira"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
            <Input
              id="telefone"
              type="tel"
              label="Telefone"
              placeholder="(00) 00000-0000"
              required
            />
            <Input id="nascimento" type="date" label="Data de Nascimento" />
          </div>

          <Input
            id="endereco"
            label="Endereço"
            placeholder="Rua, número, bairro, cidade"
          />

          <TextArea
            id="observacao"
            label="Observação"
            helperText="anotações, necessidades"
            placeholder="Registre informações importantes para o acompanhamento..."
          />

          <p className="text-xs text-samu-neutral mb-6 -mt-4">
            <span className="text-samu-danger font-bold">*</span> Campos obrigatórios
          </p>

          <div className="border-t border-samu-border mb-6"></div>

          {/* Botões Reutilizáveis */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)} type="button">
              Cancelar
            </Button>

            <Button variant="primary" icon={faCheck} type="submit">
              Salvar Cadastro
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

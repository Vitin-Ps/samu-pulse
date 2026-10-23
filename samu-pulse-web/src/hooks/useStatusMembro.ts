import {useEffect, useState} from 'react';
import {StatusMembro} from '../interfaces/StatusMembro';
import StatusMembroService from '../services/StatusMembroService';
import useTratadorErroApi from './useTratadorErroApi';

export const useStatusMembro = () => {
  const [status, setStatus] = useState<StatusMembro[]>([]);
  const {handleRequest, loading} = useTratadorErroApi();

  const carregarStatus = async () => {
    const resposta = await handleRequest(() => StatusMembroService.listar());
    if (resposta) setStatus(resposta);
  };

  useEffect(() => { carregarStatus(); }, []);

  const statusMembroOptions = status.map(item => ({
    value: item.cod_status,
    text: item.nome,
  }));

  return {status, statusMembroOptions, carregarStatus, loading};
};

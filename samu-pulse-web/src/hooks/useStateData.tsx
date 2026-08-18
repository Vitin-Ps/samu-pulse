import {useState, useCallback} from 'react';

export const useStateData = <DataType extends unknown>(initialData: DataType) => {
  // T → DataType
  // K → PropertyKey

  const [data, setData] = useState<DataType>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Atualizar propriedade específica do estado
  const updateState = useCallback(
    <PropertyKey extends keyof DataType>(
      key: PropertyKey,
      value: DataType[PropertyKey],
    ) => {
      setData(prev => {
        if (!prev) return initialData;
        return {...prev, [key]: value};
      });
      setError(null);
    },
    [],
  );

  // Definir o estado completo
  const setState = useCallback((newData: DataType) => {
    setData(newData);
    setError(null);
  }, []);

  // Resetar estado para valores iniciais
  const resetState = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, []);

  // Definir erro
  const setStateError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Definir loading
  const setStateLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  // Atualizar múltiplas propriedades de uma vez
  const updateMultipleStates = useCallback((newData: Partial<DataType> | null) => {
    setData(prev => {
      if (newData === null) return initialData;
      if (!prev) return newData as DataType;
      return {...prev, ...newData};
    });
    setError(null);
  }, []);

  return {
    data,
    error,
    loading,
    updateState,
    setState,
    resetState,
    setStateError,
    setStateLoading,
    updateMultipleStates,
  };
};

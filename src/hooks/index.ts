import { useMemo } from 'react';
import { calculateAge } from '@/utils';

/**
 * Hook para calcular a idade de um animal com base na data de compra
 * Retorna a idade formatada como string
 */
export function useAnimalAge(dataCompra: Date): string {
  return useMemo(() => {
    return calculateAge(dataCompra);
  }, [dataCompra]);
}

/**
 * Hook para obter a data atual formatada para input de data
 */
export function useCurrentDate(): string {
  return useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);
}

/**
 * Hook para converter arquivo para Base64
 */
export function useFileToBase64() {
  const convertFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return convertFile;
}


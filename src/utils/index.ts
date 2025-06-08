import { Animal } from "@/types";

/**
 * Calcula a idade com base na data de compra
 * Retorna no formato "X anos, Y meses"
 */
export function calculateAge(dataCompra: Date): string {
  const now = new Date();
  const purchaseDate = new Date(dataCompra);

  let years = now.getFullYear() - purchaseDate.getFullYear();
  let months = now.getMonth() - purchaseDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0) {
    return "Menos de 1 mês";
  }

  if (years === 0) {
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  }

  return `${years} ${years === 1 ? "ano" : "anos"}, ${months} ${
    months === 1 ? "mês" : "meses"
  }`;
}

/**
 * Gera um ID único para novos animais
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

/**
 * Exporta animais para formato de texto
 */
export function exportAnimals(animals: Animal[]): string {
  const animalsData = animals.map((animal) => ({
    categoria: animal.categoria,
    especie: animal.especie,
    quantidade: animal.quantidade,
    dataCompra: animal.dataCompra,
    dataNascimento: animal.dataNascimento,
    valor: animal.valor,
    tamanho: animal.tamanho,
    origem: animal.origem,
    observacao: animal.observacao,
  }));

  return `ANIMAL::${animalsData
    .map((animal) => JSON.stringify(animal))
    .join("::")}`;
}

/**
 * Importa animais do formato de texto
 */
export function importAnimals(importText: string): Animal[] {
  if (!importText.startsWith("ANIMAL::")) {
    throw new Error("Formato inválido");
  }

  const dataText = importText.replace("ANIMAL::", "");
  const animalStrings = dataText.split("::");

  return animalStrings.map((animalStr) => {
    const animalData = JSON.parse(animalStr);
    return {
      ...animalData,
      id: generateId(),
      dataCompra: new Date(animalData.dataCompra),
      dataNascimento: animalData.dataNascimento
        ? new Date(animalData.dataNascimento)
        : undefined,
    } as Animal;
  });
}

/**
 * Gera link do WhatsApp com dados exportados
 */
export function generateWhatsAppLink(exportText: string): string {
  const encodedText = encodeURIComponent(exportText);
  return `https://wa.me/?text=${encodedText}`;
}

/**
 * Obtém categorias únicas dos animais
 */
export function getUniqueCategories(animals: Animal[]): string[] {
  const categories = animals.map((animal) => animal.categoria);
  return Array.from(new Set(categories)).sort();
}

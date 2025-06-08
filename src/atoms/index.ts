import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Animal } from "@/types";

// Átomo para lista de animais com persistência no localStorage
export const animalsAtom = atomWithStorage<Animal[]>("animals", []);

// Átomo para tema (escuro/claro)
export const themeAtom = atomWithStorage<"light" | "dark">("theme", "light");

// Átomo derivado para estatísticas do dashboard
export const dashboardStatsAtom = atom((get) => {
  const animals = get(animalsAtom);

  const totalAnimais = animals.length;
  const totalPorCategoria: Record<string, number> = {};
  const totalPorEspecie: Record<string, number> = {};
  let valorTotal = 0;
  let quantidadeTotal = 0;

  animals.forEach((animal) => {
    // Contagem por categoria
    totalPorCategoria[animal.categoria] =
      (totalPorCategoria[animal.categoria] || 0) + 1;

    // Contagem por espécie
    totalPorEspecie[animal.especie] =
      (totalPorEspecie[animal.especie] || 0) + 1;

    // Soma valores e quantidades
    valorTotal += animal.valor * animal.quantidade;
    quantidadeTotal += animal.quantidade;
  });

  return {
    totalAnimais,
    totalPorCategoria,
    totalPorEspecie,
    valorTotal,
    quantidadeTotal,
  };
});

// Átomo para filtros
export const filtersAtom = atom({
  categoria: "",
  quantidadeMinima: 0,
  busca: "",
});

// Átomo para ordenação
export const sortAtom = atom<{
  field: string;
  direction: "asc" | "desc";
}>({
  field: "categoria" as const,
  direction: "asc" as const,
});

// Átomo derivado para animais filtrados e ordenados
export const filteredAnimalsAtom = atom((get) => {
  const animals = get(animalsAtom);
  const filters = get(filtersAtom);
  const sort = get(sortAtom);

  const filtered = animals.filter((animal) => {
    // Filtro por categoria
    if (filters.categoria && animal.categoria !== filters.categoria) {
      return false;
    }

    // Filtro por quantidade mínima
    if (
      filters.quantidadeMinima &&
      animal.quantidade < filters.quantidadeMinima
    ) {
      return false;
    }

    // Filtro por busca (categoria ou espécie)
    if (filters.busca) {
      const searchTerm = filters.busca.toLowerCase();
      const matchesCategoria = animal.categoria
        .toLowerCase()
        .includes(searchTerm);
      const matchesEspecie = animal.especie.toLowerCase().includes(searchTerm);

      if (!matchesCategoria && !matchesEspecie) {
        return false;
      }
    }

    return true;
  });

  // Ordenação
  filtered.sort((a, b) => {
    let aValue: any = a[sort.field];
    let bValue: any = b[sort.field];

    // Tratamento especial para datas
    if (sort.field === "dataCompra") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sort.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

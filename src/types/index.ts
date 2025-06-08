export interface Animal {
  id: string;
  categoria: string; // máx. 40 caracteres
  especie: string; // máx. 50 caracteres
  quantidade: number; // inteiro positivo
  dataCompra: Date; // default = hoje
  dataNascimento?: Date; // opcional
  valor: number; // decimal
  tamanho: number; // decimal
  origem: string; // máx. 100 caracteres
  observacao?: string; // máx. 254 caracteres, opcional
  imageUrl?: string | null | undefined;
}

export interface FilterOptions {
  categoria?: string;
  quantidadeMinima?: number;
  busca?: string;
}

export interface SortOptions {
  field: "categoria" | "especie" | "quantidade" | "dataCompra" | "valor";
  direction: "asc" | "desc";
}

export interface DashboardStats {
  totalAnimais: number;
  totalPorCategoria: Record<string, number>;
  totalPorEspecie: Record<string, number>;
  valorTotal: number;
  quantidadeTotal: number;
}

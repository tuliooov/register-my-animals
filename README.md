# 🐾 Plataforma de Cadastro de Animais

Uma Progressive Web App (PWA) moderna para cadastro e gerenciamento de animais, desenvolvida com as tecnologias mais recentes.

## 🚀 Tecnologias Utilizadas

- **Next.js 15.3.3** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Jotai** - Gerenciamento de estado global
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas
- **Material UI** - Componentes de interface
- **Lucide Icons** - Ícones modernos
- **@dnd-kit** - Funcionalidade drag-and-drop
- **localStorage** - Persistência de dados local

## ✨ Funcionalidades

### 📋 Cadastro de Animais

- Formulário completo com validação
- Campos: categoria, espécie, quantidade, datas, valor, tamanho, origem, observações
- Upload de imagem com preview
- Validação em tempo real com Zod

### 📊 Dashboard

- Visão geral com estatísticas
- Totais por categoria e espécie
- Valor total e quantidade total
- Histórico de ações recentes

### 📝 Listagem e Filtros

- Visualização em grade ou lista
- Filtros por categoria e quantidade mínima
- Busca por espécie
- Ordenação por diferentes campos
- Cálculo automático de idade

### 🎯 Drag and Drop

- Reordenação de animais por arrastar e soltar
- Persistência da nova ordem
- Interface intuitiva com @dnd-kit

### 📤 Exportação/Importação

- Exportação para formato de texto
- Compartilhamento via WhatsApp
- Download de arquivo
- Importação de dados de outras fontes

### 📈 Histórico de Ações

- Registro de todas as operações
- Estatísticas de ações por tipo
- Visualização cronológica

### 🎨 Interface

- Tema escuro/claro
- Design responsivo
- Material Design
- Ícones modernos

### 📱 PWA

- Instalável como app nativo
- Funciona offline
- Service Worker configurado
- Manifest.json otimizado

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd animal-registry

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Executar versão de produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas do App Router
│   ├── cadastro/          # Página de cadastro
│   ├── lista/             # Página de listagem
│   ├── historico/         # Página de histórico
│   ├── importar-exportar/ # Página de import/export
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard
├── components/            # Componentes reutilizáveis
│   ├── DraggableAnimalList.tsx
│   ├── Layout.tsx
│   └── ThemeProvider.tsx
├── atoms/                 # Estados globais Jotai
├── hooks/                 # Hooks personalizados
├── types/                 # Tipos TypeScript
├── utils/                 # Funções utilitárias
│   ├── index.ts
│   └── schemas.ts
public/
├── manifest.json          # Manifest PWA
├── sw.js                  # Service Worker
├── icon-192x192.png       # Ícone PWA 192px
└── icon-512x512.png       # Ícone PWA 512px
```

## 🎯 Como Usar

### 1. Dashboard

- Acesse a página inicial para ver estatísticas gerais
- Visualize totais por categoria e espécie
- Acompanhe ações recentes

### 2. Cadastrar Animal

- Preencha todos os campos obrigatórios
- Selecione uma categoria do dropdown
- Adicione uma imagem (opcional)
- A data de compra é preenchida automaticamente com hoje

### 3. Lista de Animais

- Alterne entre visualização em grade e lista
- Use filtros para encontrar animais específicos
- Ordene por diferentes critérios
- No modo lista, arraste para reordenar

### 4. Exportar/Importar

- Exporte seus dados para backup
- Compartilhe via WhatsApp
- Importe dados de outras fontes
- Baixe arquivo de backup

### 5. Histórico

- Visualize todas as ações realizadas
- Veja estatísticas por tipo de ação
- Limpe o histórico quando necessário

## 🔧 Configurações Técnicas

### Estado Global (Jotai)

- `animalsAtom`: Lista de animais
- `themeAtom`: Tema atual (claro/escuro)
- `filtersAtom`: Filtros ativos
- `sortAtom`: Ordenação atual

### Persistência

- Dados salvos automaticamente no localStorage
- Sincronização em tempo real
- Recuperação automática ao recarregar

### Validação

- Schemas Zod para validação robusta
- Mensagens de erro em português
- Validação em tempo real

### PWA

- Instalável em dispositivos móveis
- Funciona offline (páginas visitadas)
- Ícones otimizados para diferentes tamanhos

## 🎨 Personalização

### Temas

O tema pode ser alternado entre claro e escuro usando o botão no cabeçalho. A preferência é salva automaticamente.

### Cores

As cores principais podem ser modificadas em `src/components/ThemeProvider.tsx`:

- Primary: #2196f3 (azul)
- Secondary: #ff9800 (laranja)

### Categorias

Novas categorias podem ser adicionadas em `src/app/cadastro/page.tsx` no array `categorias`.

## 📱 Instalação como PWA

1. Acesse a aplicação no navegador
2. No Chrome/Edge: clique no ícone de instalação na barra de endereços
3. No Safari: Menu > Adicionar à Tela Inicial
4. No Firefox: Menu > Instalar

## 🔒 Privacidade

- Todos os dados são armazenados localmente no dispositivo
- Nenhuma informação é enviada para servidores externos
- Dados podem ser exportados e importados conforme necessário

## 🐛 Solução de Problemas

### Dados não aparecem

- Verifique se o localStorage está habilitado
- Limpe o cache do navegador se necessário

### Imagens não carregam

- Verifique o tamanho do arquivo (recomendado < 5MB)
- Formatos suportados: JPG, PNG, WebP, GIF

### PWA não instala

- Certifique-se de estar usando HTTPS
- Verifique se o navegador suporta PWA
- Tente recarregar a página

## 📄 Licença

Este projeto foi desenvolvido como uma demonstração de tecnologias modernas de desenvolvimento web.

## 🤝 Contribuições

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

---

Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento web moderno.

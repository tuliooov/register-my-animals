
'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  FilterList,
  Sort,
  Pets,
  GridView,
  ViewList,
} from '@mui/icons-material';
import { useAtom } from 'jotai';
import { animalsAtom, filtersAtom, sortAtom, filteredAnimalsAtom } from '@/atoms';
import { Layout } from '@/components/Layout';
import { DraggableAnimalList } from '@/components/DraggableAnimalList';
import { useState } from 'react';
import { formatCurrency, formatDate, getUniqueCategories } from '@/utils';
import { useAnimalAge } from '@/hooks';
import { Animal } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ListaAnimais() {
  const router = useRouter();
  const [animals, setAnimals] = useAtom(animalsAtom);
  const [filteredAnimals] = useAtom(filteredAnimalsAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [sort, setSort] = useAtom(sortAtom);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; animal: Animal | null }>({
    open: false,
    animal: null,
  });

  const uniqueCategories = getUniqueCategories(animals);

  const handleFilterChange = (field: keyof typeof filters, value: string | number) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSortChange = (field: typeof sort.field) => {
    if (sort.field === field) {
      setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  const handleDelete = (animal: Animal) => {
    setDeleteDialog({ open: true, animal });
  };

  const handleEdt = (animal: Animal) => {
    router.push(`/cadastro?id=${animal.id}`)
  }

  const confirmDelete = () => {
    if (deleteDialog.animal) {
      const updatedAnimals = animals.filter(a => a.id !== deleteDialog.animal!.id);
      setAnimals(updatedAnimals);
    }
    setDeleteDialog({ open: false, animal: null });
  };

  const AnimalCard = ({ animal }: { animal: Animal }) => {
    const age = useAnimalAge(animal.dataCompra);

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {animal.especie}
              </Typography>
              <Chip
                label={animal.categoria}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" onClick={() => {
                router.push(`/cadastro?id=${animal.id}`)
              }}>
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(animal)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          {animal.imageUrl && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <img src={animal.imageUrl} alt={animal.especie} style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: '4px' }} />
            </Box>
          )}

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Quantidade: {animal.quantidade}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Tamanho: {animal.tamanho} cm
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Valor: {formatCurrency(animal.valor)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Idade: {age}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Origem:</strong> {animal.origem}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Data de Compra:</strong> {formatDate(animal.dataCompra)}
          </Typography>

          {animal.dataNascimento && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Data de Nascimento:</strong> {formatDate(animal.dataNascimento)}
            </Typography>
          )}

          {animal.observacao && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Observação:</strong> {animal.observacao}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Lista de Animais
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            aria-label="modo de visualização"
          >
            <ToggleButton value="grid" aria-label="visualização em grade">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" aria-label="visualização em lista">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Filtros e Busca */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          Filtros e Busca
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar por espécie"
              value={filters.busca}
              onChange={(e) => handleFilterChange('busca', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.categoria}
                label="Categoria"
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {uniqueCategories.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Quantidade mínima"
              type="number"
              value={filters.quantidadeMinima}
              onChange={(e) => handleFilterChange('quantidadeMinima', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sort />
          Ordenação
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { field: 'categoria' as const, label: 'Categoria' },
            { field: 'especie' as const, label: 'Espécie' },
            { field: 'quantidade' as const, label: 'Quantidade' },
            { field: 'valor' as const, label: 'Valor' },
            { field: 'dataCompra' as const, label: 'Data de Compra' },
          ].map((sortOption) => (
            <Chip
              key={sortOption.field}
              label={`${sortOption.label} ${sort.field === sortOption.field ? (sort.direction === 'asc' ? '↑' : '↓') : ''}`}
              onClick={() => handleSortChange(sortOption.field)}
              color={sort.field === sortOption.field ? 'primary' : 'default'}
              variant={sort.field === sortOption.field ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Paper>

      {/* Lista de Animais */}
      {filteredAnimals.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Pets sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum animal encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {animals.length === 0
              ? 'Comece cadastrando seu primeiro animal!'
              : 'Tente ajustar os filtros de busca.'
            }
          </Typography>
        </Paper>
      ) : viewMode === 'list' ? (
        <DraggableAnimalList
          animals={filteredAnimals}
          onDelete={handleDelete}
          onEdit={handleEdt}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredAnimals.map((animal) => (
            <Grid key={animal.id} item xs={12} sm={6} md={4}>
              <AnimalCard animal={animal} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, animal: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o animal <strong>{deleteDialog.animal?.especie}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, animal: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}



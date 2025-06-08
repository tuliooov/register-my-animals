
'use client';

import { useAtom } from 'jotai';
import { animalsAtom } from '@/atoms';
import { animalSchema, AnimalFormData } from '@/utils/schemas';
import { generateId, } from '@/utils';
import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Animal } from '@/types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { zodResolver } from '@hookform/resolvers/zod';

const categorias = [
  'Peixe',
  'Pássaro',
  'Mamífero',
  'Réptil',
  'Anfíbio',
  'Invertebrado',
  'Outro',
];

export default function CadastroAnimal() {
  const [animals, setAnimals] = useAtom(animalsAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const animalId = searchParams.get('id');

  const isEditing = !!animalId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      categoria: '',
      especie: '',
      quantidade: 1,
      dataCompra: new Date(),
      valor: 0,
      tamanho: 0,
      origem: '',
      observacao: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isEditing) {
      const animalToEdit = animals.find(animal => animal.id === animalId);
      if (animalToEdit) {
        reset({
          ...animalToEdit,
          dataCompra: animalToEdit.dataCompra ? new Date(animalToEdit.dataCompra) : new Date(),
          dataNascimento: animalToEdit.dataNascimento ? new Date(animalToEdit.dataNascimento) : undefined,
        });
      } else {
        router.push('/cadastro');
      }
    }
  }, [animalId, animals, isEditing, reset, router]);

  const onSubmit: SubmitHandler<AnimalFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const animalData: Animal = {
        id: isEditing && animalId ? animalId : generateId(),
        categoria: data.categoria,
        especie: data.especie,
        quantidade: data.quantidade,
        dataCompra: new Date(data.dataCompra),
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
        valor: data.valor,
        tamanho: data.tamanho,
        origem: data.origem,
        observacao: data.observacao,
      };

      if (isEditing) {
        setAnimals(prev => prev.map(animal => animal.id === animalId ? animalData : animal));
        setSubmitMessage({ type: 'success', text: 'Animal atualizado com sucesso!' });
      } else {
        setAnimals(prev => [...prev, animalData]);
        setSubmitMessage({ type: 'success', text: 'Animal cadastrado com sucesso!' });
        reset({
          ...data,
          dataCompra: new Date(),
        });
      }

      router.push('/lista')

    } catch (error) {
      console.error('Erro ao salvar animal:', error);
      setSubmitMessage({ type: 'error', text: 'Erro ao salvar animal. Verifique os dados.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    reset({
      categoria: '',
      especie: '',
      quantidade: 1,
      dataCompra: new Date(),
      dataNascimento: undefined,
      valor: 0,
      tamanho: 0,
      origem: '',
      observacao: '',
    });
    setSubmitMessage(null);
    router.replace('/cadastro'); // Limpa a URL para remover o ID de edição
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Editar Animal' : 'Cadastrar Animal'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditing ? 'Edite os dados do animal existente' : 'Preencha os dados do animal para cadastro'}
        </Typography>
      </Box>

      {submitMessage && (
        <Alert severity={submitMessage.type} sx={{ mb: 3 }}>
          {submitMessage.text}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Categoria */}
              <Grid minWidth={150}>
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoria}>
                      <InputLabel>Categoria *</InputLabel>
                      <Select {...field} label="Categoria *">
                        {categorias.map((categoria) => (
                          <MenuItem key={categoria} value={categoria}>
                            {categoria}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.categoria && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.categoria.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Espécie */}
              <Grid>
                <Controller
                  name="especie"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Espécie *"
                      error={!!errors.especie}
                      helperText={errors.especie?.message}
                    />
                  )}
                />
              </Grid>

              {/* Quantidade */}
              <Grid >
                <Controller
                  name="quantidade"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Quantidade *"
                      type="number"
                      inputProps={{ min: 1 }}
                      error={!!errors.quantidade}
                      helperText={errors.quantidade?.message}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              {/* Valor */}
              <Grid >
                <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Valor *"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                      error={!!errors.valor}
                      helperText={errors.valor?.message}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              {/* Tamanho */}
              <Grid >
                <Controller
                  name="tamanho"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tamanho *"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                      }}
                      error={!!errors.tamanho}
                      helperText={errors.tamanho?.message}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              {/* Data de Compra */}
              <Grid>
                <Controller
                  name="dataCompra"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Data de Compra *"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dataCompra}
                      helperText={errors.dataCompra?.message}
                      value={field.value ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  )}
                />
              </Grid>

              {/* Data de Nascimento */}
              <Grid>
                <Controller
                  name="dataNascimento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Data de Nascimento"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dataNascimento}
                      helperText={errors.dataNascimento?.message}
                      value={field.value ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  )}
                />
              </Grid>

              {/* Origem */}
              <Grid >
                <Controller
                  name="origem"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Origem *"
                      error={!!errors.origem}
                      helperText={errors.origem?.message}
                    />
                  )}
                />
              </Grid>

              {/* Observação */}
              <Grid >
                <Controller
                  name="observacao"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Observação"
                      multiline
                      rows={3}
                      error={!!errors.observacao}
                      helperText={errors.observacao?.message}
                    />
                  )}
                />
              </Grid>

              {/* Botões */}
              <Grid >
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleClearForm}
                    startIcon={<ClearIcon />}
                    disabled={isSubmitting}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Animal')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}



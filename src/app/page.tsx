"use client"

import { useAtomValue } from 'jotai';
import { dashboardStatsAtom } from '@/atoms';
import { Layout } from '@/components/Layout';
import { formatCurrency } from '@/utils';
import { Pets, TrendingUp, AttachMoney, Numbers } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Paper, Typography } from '@mui/material';

export default function Dashboard() {
  const stats = useAtomValue(dashboardStatsAtom);

  const statCards = [
    {
      title: 'Total de Animais',
      value: stats.totalAnimais,
      icon: <Pets sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Quantidade Total',
      value: stats.quantidadeTotal,
      icon: <Numbers sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary.main',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(stats.valorTotal),
      icon: <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'Categorias',
      value: Object.keys(stats.totalPorCategoria).length,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main',
    },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral do seu cadastro de animais
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Animais por Categoria */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Animais por Categoria
            </Typography>
            {Object.keys(stats.totalPorCategoria).length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Object.entries(stats.totalPorCategoria).map(([categoria, quantidade]) => (
                  <Chip
                    key={categoria}
                    label={`${categoria}: ${quantidade}`}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum animal cadastrado ainda
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Animais por Espécie */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Animais por Espécie
            </Typography>
            {Object.keys(stats.totalPorEspecie).length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Object.entries(stats.totalPorEspecie).map(([especie, quantidade]) => (
                  <Chip
                    key={especie}
                    label={`${especie}: ${quantidade}`}
                    variant="outlined"
                    color="secondary"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum animal cadastrado ainda
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
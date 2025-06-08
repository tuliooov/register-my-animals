'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  Paper,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Download,
  Upload,
  WhatsApp,
  ContentCopy,
  FileDownload,
} from '@mui/icons-material';
import { useAtom } from 'jotai';
import { animalsAtom } from '@/atoms';
import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { exportAnimals, importAnimals, generateWhatsAppLink } from '@/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { importSchema, ImportFormData } from '@/utils/schemas';

export default function ImportarExportar() {
  const [animals, setAnimals] = useAtom(animalsAtom);
  const [exportedText, setExportedText] = useState('');
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      importText: '',
    },
  });

  const handleExport = () => {
    if (animals.length === 0) {
      setSnackbar({ open: true, message: 'Nenhum animal para exportar' });
      return;
    }

    const exported = exportAnimals(animals);
    setExportedText(exported);
  };

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(exportedText);
    setSnackbar({ open: true, message: 'Texto copiado para a área de transferência!' });
  };

  const handleWhatsAppShare = () => {
    if (!exportedText) {
      setSnackbar({ open: true, message: 'Primeiro exporte os dados' });
      return;
    }

    const whatsappUrl = generateWhatsAppLink(exportedText);
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadFile = () => {
    if (!exportedText) {
      setSnackbar({ open: true, message: 'Primeiro exporte os dados' });
      return;
    }

    const blob = new Blob([exportedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animais-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'Arquivo baixado com sucesso!' });
  };

  const onImportSubmit = (data: ImportFormData) => {
    setImportMessage(null);

    try {
      const importedAnimals = importAnimals(data.importText);

      if (importedAnimals.length === 0) {
        setImportMessage({ type: 'error', text: 'Nenhum animal encontrado no texto importado' });
        return;
      }

      // Adicionar animais importados aos existentes
      setAnimals(prev => [...prev, ...importedAnimals]);

      setImportMessage({
        type: 'success',
        text: `${importedAnimals.length} animais importados com sucesso!`
      });

      reset();

    } catch (error) {
      setImportMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao importar dados'
      });
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Importar/Exportar Dados
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Exporte seus dados para compartilhar ou faça backup, e importe dados de outras fontes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Exportação */}
        <Grid>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Download />
                Exportar Dados
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Exporte todos os seus animais cadastrados para um formato de texto que pode ser compartilhado ou salvo.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  label={`${animals.length} animais cadastrados`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleExport}
                startIcon={<Download />}
                fullWidth
                disabled={animals.length === 0}
                sx={{ mb: 2 }}
              >
                Exportar Dados
              </Button>

              {exportedText && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dados Exportados:
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={exportedText}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCopyToClipboard}
                      startIcon={<ContentCopy />}
                      size="small"
                    >
                      Copiar
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleWhatsAppShare}
                      startIcon={<WhatsApp />}
                      size="small"
                      color="success"
                    >
                      WhatsApp
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleDownloadFile}
                      startIcon={<FileDownload />}
                      size="small"
                    >
                      Baixar
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Importação */}
        <Grid>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Upload />
                Importar Dados
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Cole aqui o texto exportado de outra fonte para importar animais. Os dados serão adicionados aos existentes.
              </Typography>

              {importMessage && (
                <Alert severity={importMessage.type} sx={{ mb: 3 }}>
                  {importMessage.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onImportSubmit)}>
                <Controller
                  name="importText"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Texto para Importação"
                      multiline
                      rows={6}
                      placeholder="Cole aqui o texto exportado que começa com 'ANIMAL::'"
                      error={!!errors.importText}
                      helperText={errors.importText?.message}
                      sx={{ mb: 3 }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Upload />}
                  fullWidth
                >
                  Importar Dados
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Instruções */}
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Como Usar
            </Typography>

            <Grid container spacing={3}>
              <Grid>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Download />
                  Exportação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Clique em &quot;Exportar Dados&quot; para gerar o texto<br />
                  2. Use &quot;Copiar&quot; para copiar para área de transferência<br />
                  3. Use &quot;WhatsApp&quot; para compartilhar diretamente<br />
                  4. Use &quot;Baixar&quot; para salvar como arquivo
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Upload />
                  Importação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Cole o texto exportado no campo de importação<br />
                  2. O texto deve começar com &quot;ANIMAL::&quot;<br />
                  3. Clique em &quot;Importar Dados&quot;<br />
                  4. Os animais serão adicionados à sua lista
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsApp />
                  WhatsApp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Exporte seus dados primeiro<br />
                  2. Clique no botão &quot;WhatsApp&quot;<br />
                  3. Escolha o contato para enviar<br />
                  4. O destinatário pode importar os dados
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Layout>
  );
}


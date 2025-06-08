'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import {
  DragIndicator,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useAtom } from 'jotai';
import { animalsAtom, } from '@/atoms';
import { Animal } from '@/types';
import { formatCurrency, formatDate, } from '@/utils';
import { useAnimalAge } from '@/hooks';

interface SortableAnimalCardProps {
  animal: Animal;
  onEdit?: (animal: Animal) => void;
  onDelete?: (animal: Animal) => void;
}

function SortableAnimalCard({ animal, onEdit, onDelete }: SortableAnimalCardProps) {
  const age = useAnimalAge(animal.dataCompra);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: animal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Drag Handle */}
          <IconButton
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
              mt: -1,
            }}
          >
            <DragIndicator />
          </IconButton>

          {/* Conteúdo Principal */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" component="h3">
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
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit?.(animal)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete?.(animal)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Quantidade:</strong> {animal.quantidade}
                </Typography>
              </Grid>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Tamanho:</strong> {animal.tamanho} cm
                </Typography>
              </Grid>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Valor:</strong> {formatCurrency(animal.valor)}
                </Typography>
              </Grid>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Idade:</strong> {age}
                </Typography>
              </Grid>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Origem:</strong> {animal.origem}
                </Typography>
              </Grid>
              <Grid >
                <Typography variant="body2" color="text.secondary">
                  <strong>Data de Compra:</strong> {formatDate(animal.dataCompra)}
                </Typography>
              </Grid>
            </Grid>

            {animal.observacao && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Observação:</strong> {animal.observacao}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface DraggableAnimalListProps {
  animals: Animal[];
  onEdit?: (animal: Animal) => void;
  onDelete?: (animal: Animal) => void;
}

export function DraggableAnimalList({ animals, onEdit, onDelete }: DraggableAnimalListProps) {
  const [, setAnimals] = useAtom(animalsAtom);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = animals.findIndex((animal) => animal.id === active.id);
      const newIndex = animals.findIndex((animal) => animal.id === over.id);

      const reorderedAnimals = arrayMove(animals, oldIndex, newIndex);
      setAnimals(reorderedAnimals);
    }
  };

  if (animals.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Nenhum animal encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comece cadastrando seu primeiro animal!
        </Typography>
      </Paper>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={animals.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <Box>
          {animals.map((animal) => (
            <SortableAnimalCard
              key={animal.id}
              animal={animal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}


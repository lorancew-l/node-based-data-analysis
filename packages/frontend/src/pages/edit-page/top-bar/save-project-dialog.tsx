import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import { TextField, FormControlLabel, Checkbox, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import { Project } from '../../../api';
import { useSaveProjectRequest } from '../../../api';
import { SavedAppState } from '../../../types';

const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 'none',
    background: theme.palette.background.default,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fieldList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minWidth: 300,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

type ProjectForm = Pick<Project, 'title' | 'description' | 'published'>;

type SaveProjectDialogProps = {
  isOpen: boolean;
  getData(): SavedAppState;
  onClose(): void;
};

export const SaveProjectDialog: React.FC<SaveProjectDialogProps> = ({ isOpen, onClose, getData }) => {
  const { classes } = useStyles();

  const { register, handleSubmit } = useForm<ProjectForm>({
    shouldUseNativeValidation: false,
    reValidateMode: 'onChange',
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      published: true,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (formValues: ProjectForm) => {
    saveProject({ ...formValues, data: getData() });
  };

  const { saveProject, isLoading } = useSaveProjectRequest({
    onSuccess: (project) => {
      navigate(`/edit/${project.id}`);
    },
  });

  return (
    <Dialog PaperProps={{ className: classes.paper }} open={isOpen} onClose={onClose} keepMounted={false}>
      <DialogContent>
        <form className={classes.container} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Avatar className={classes.avatar}>
            <SaveIcon />
          </Avatar>

          <Typography className={classes.title} component="h1" variant="h5">
            Сохранение
          </Typography>

          <div className={classes.fieldList}>
            <TextField {...register('title', { required: 'Обязательное поле' })} label="Название" required fullWidth />

            <TextField {...register('description', { required: 'Обязательное поле' })} label="Описание" fullWidth multiline />

            <FormControlLabel
              control={<Checkbox defaultChecked {...register('published', { required: 'Обязательное поле' })} />}
              label="Публичный доступ"
            />
          </div>

          <Button
            startIcon={isLoading ? <CircularProgress color="info" size={16} /> : undefined}
            className={classes.button}
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
          >
            Сохранить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

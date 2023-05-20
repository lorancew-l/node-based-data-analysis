import { useEffect, useMemo, useRef } from 'react';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import { TextField, FormControlLabel, Checkbox, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useController, useForm } from 'react-hook-form';
import { makeStyles } from 'tss-react/mui';
import { Project } from '../../../api';
import { useAppSelector } from '../../../store';
import { selectProject } from '../../../store/selectors/project-selector';

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
  isLoading: boolean;
  title: string;
  isOpen: boolean;
  onClose(): void;
  onSubmit(form: ProjectForm): void;
};

export const SaveProjectDialog: React.FC<SaveProjectDialogProps> = ({ title, isLoading, isOpen, onClose, onSubmit }) => {
  const { classes } = useStyles();

  const previousTitle = useRef<string>('');

  const dialogTitle = useMemo(() => (isOpen ? title : previousTitle.current), [isOpen]);

  useEffect(() => {
    previousTitle.current = title;
  }, [isOpen]);

  return (
    <Dialog PaperProps={{ className: classes.paper }} open={isOpen} onClose={onClose} keepMounted={false}>
      <SaveProjectDialogContent title={dialogTitle} isLoading={isLoading} onSubmit={onSubmit} />
    </Dialog>
  );
};

type SaveProjectDialogContentProps = {
  isLoading: boolean;
  title: string;
  onSubmit(form: ProjectForm): void;
};

const SaveProjectDialogContent: React.FC<SaveProjectDialogContentProps> = ({ title, isLoading, onSubmit }) => {
  const { classes } = useStyles();

  const project = useAppSelector(selectProject);

  const { handleSubmit, control } = useForm<ProjectForm>({
    shouldUseNativeValidation: false,
    reValidateMode: 'onChange',
    mode: 'onBlur',
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      published: project?.published ?? false,
    },
  });

  const { fieldState: titleFieldState, field: titleField } = useController({ name: 'title', control });
  const titleErrorMessage = titleFieldState?.error?.message;

  const { field: descriptionField } = useController({ name: 'description', control });

  const { field: publishedField } = useController({ name: 'published', control });

  const onFormSubmit = (formValues: ProjectForm) => {
    onSubmit(formValues);
  };

  return (
    <DialogContent>
      <form className={classes.container} onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Avatar className={classes.avatar}>
          <SaveIcon />
        </Avatar>

        <Typography className={classes.title} component="h1" variant="h5">
          {title}
        </Typography>

        <div className={classes.fieldList}>
          <TextField {...titleField} label="Название" error={!!titleErrorMessage} helperText={titleErrorMessage} required />

          <TextField key="test" {...descriptionField} label="Описание" fullWidth multiline />

          <FormControlLabel
            control={<Checkbox checked={publishedField.value} onChange={publishedField.onChange} />}
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
  );
};

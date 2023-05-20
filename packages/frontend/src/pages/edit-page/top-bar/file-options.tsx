import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Tooltip, IconButton } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { useReactFlow } from 'reactflow';
import { makeStyles } from 'tss-react/mui';

import { useAppStore, useAppDispatch, reset, useAppSelector } from '../../../store';
import { SavedAppState } from '../../../types';
import { Menu } from '../../../components';
import { useUser } from '../../../auth-context';
import { Project, useSaveProjectRequest } from '../../../api';
import { SaveProjectDialog } from './save-project-dialog';
import { useReadonlyContext } from '../readonly-context';
import { selectProject } from '../../../store/selectors/project-selector';
import { exportToJson, loadJson } from '../utils';
import { setProject } from '../../../store/reducers/project';

const useStyles = makeStyles()(() => ({
  iconButton: {
    padding: 0,
  },
}));

enum SaveDialogState {
  Save,
  Clone,
  Closed,
}

enum FileOption {
  Export,
  Load,
  Save,
  Clone,
}

type FileOptionsProps = {
  className?: string;
};

export const FileOptions: React.FC<FileOptionsProps> = ({ className }) => {
  const { classes, cx } = useStyles();

  const inputRef = useRef<HTMLInputElement>();
  const anchorRef = useRef<HTMLAnchorElement>();

  const reactFlowInstance = useReactFlow();
  const store = useAppStore();

  const readonly = useReadonlyContext();

  const { id: projectId, title: projectTitle } = useAppSelector(selectProject) ?? {};

  const dispatch = useAppDispatch();

  const user = useUser();

  const [saveDialogState, setSaveDialogState] = useState(SaveDialogState.Closed);

  const fileOptions = [
    { label: 'Экспортировать', value: FileOption.Export },
    ...(!readonly ? [{ label: 'Загрузить', value: FileOption.Load }] : []),
    ...(user && !readonly ? [{ label: 'Сохранить', value: FileOption.Save }] : []),
    ...(user && projectId ? [{ label: 'Клонировать', value: FileOption.Clone }] : []),
  ];

  const getAppState = () => {
    const reactFlowData = reactFlowInstance.toObject();
    const dependencies = store.getState().board.dependencies;

    return {
      reactFlow: reactFlowData,
      dependencies,
    } as SavedAppState;
  };

  const handleExport = async () => {
    const blob = await exportToJson(getAppState());
    const blobUrl = URL.createObjectURL(blob);

    anchorRef.current.href = blobUrl;
    anchorRef.current.download = `${projectTitle ?? 'untitled-project'}.nbda`;
    anchorRef.current.click();
  };

  const handleLoad = async () => {
    inputRef.current.onchange = async ({ target }: Event) => {
      const [file] = (target as HTMLInputElement).files;
      const savedAppState = await loadJson<SavedAppState>(file);

      dispatch(reset(savedAppState));
      reactFlowInstance.setViewport(savedAppState.reactFlow.viewport);
    };
    inputRef.current.click();
  };

  const handleCloseSaveDialog = () => setSaveDialogState(SaveDialogState.Closed);

  const handleOptionSelect = (option: FileOption) => {
    switch (option) {
      case FileOption.Export:
        handleExport();
        break;
      case FileOption.Load:
        handleLoad();
        break;
      case FileOption.Save:
        setSaveDialogState(SaveDialogState.Save);
        break;
      case FileOption.Clone:
        setSaveDialogState(SaveDialogState.Clone);
        break;
      default:
        break;
    }
  };

  const navigate = useNavigate();

  const { saveProject, updateProject, isLoading } = useSaveProjectRequest({
    onSuccess: (project) => {
      dispatch(setProject(project));
      navigate(`/edit/${project.id}`);
      handleCloseSaveDialog();
    },
  });

  const handleSave = (formValues: Pick<Project, 'title' | 'description' | 'published'>) => {
    const projectToSave: Project = { ...formValues, data: getAppState() };

    if (!projectId || saveDialogState === SaveDialogState.Clone) {
      saveProject(projectToSave);
    } else {
      updateProject(projectId, projectToSave);
    }

    handleCloseSaveDialog();
  };

  return (
    <>
      <Menu
        options={fileOptions}
        onSelect={handleOptionSelect}
        renderTrigger={(onClick) => (
          <Tooltip title="Файл">
            <IconButton className={cx(classes.iconButton, className)} onClick={onClick}>
              <WidgetsIcon color="primary" />
            </IconButton>
          </Tooltip>
        )}
      />

      <SaveProjectDialog
        isLoading={isLoading}
        title={saveDialogState === SaveDialogState.Save ? 'Сохранение' : 'Клонирование'}
        isOpen={saveDialogState !== SaveDialogState.Closed}
        onClose={handleCloseSaveDialog}
        onSubmit={handleSave}
      />

      <input accept=".nbda,application/json" style={{ display: 'none' }} type="file" ref={inputRef} />

      <a style={{ display: 'none' }} ref={anchorRef} />
    </>
  );
};

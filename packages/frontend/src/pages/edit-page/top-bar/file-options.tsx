import { useState } from 'react';
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
import { useNavigate } from 'react-router';
import { selectProjectId } from '../../../store/selectors/project-selector';
import { omit } from 'lodash';

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

  const reactFlowInstance = useReactFlow();
  const store = useAppStore();

  const readonly = useReadonlyContext();

  const projectId = useAppSelector(selectProjectId);

  const dispatch = useAppDispatch();

  const user = useUser();

  const [saveDialogState, setSaveDialogState] = useState(SaveDialogState.Closed);

  const fileOptions = [
    { label: 'Экспортировать', value: FileOption.Export },
    ...(!readonly ? [{ label: 'Загрузить', value: FileOption.Load }] : []),
    ...(user && !readonly ? [{ label: 'Сохранить', value: FileOption.Save }] : []),
    ...(user && readonly ? [{ label: 'Клонировать', value: FileOption.Clone }] : []),
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
    const dataToSave = JSON.stringify(getAppState());
    const fileToSave = new Blob([dataToSave], { type: 'application/json' });

    // @ts-ignore
    const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker(fileOptions);
    // @ts-ignore
    const fileStream: FileSystemWritableFileStream = await fileHandle.createWritable();

    fileStream.write(fileToSave);
    fileStream.close();
  };

  const handleLoad = async () => {
    // @ts-ignore
    const [fileHandle]: FileSystemFileHandle = await window.showOpenFilePicker(fileOptions);
    const file: File = await fileHandle.getFile();

    const fileText = await file.text();

    const savedAppState = JSON.parse(fileText) as SavedAppState;

    dispatch(reset(savedAppState));
    reactFlowInstance.setViewport(savedAppState.reactFlow.viewport);
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

  const { saveProject, isLoading } = useSaveProjectRequest({
    onSuccess: (project) => {
      navigate(`/edit/${project.id}`);
      handleCloseSaveDialog();
    },
  });

  const handleSave = (formValues: Pick<Project, 'title' | 'description' | 'published'>) => {
    let projectToSave: Project = { ...formValues, data: getAppState(), ...(projectId && { id: projectId }) };

    if (saveDialogState === SaveDialogState.Clone) {
      projectToSave = omit(projectToSave, 'id');
    }

    saveProject(projectToSave);
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
    </>
  );
};

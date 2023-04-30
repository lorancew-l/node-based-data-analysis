import { makeStyles } from 'tss-react/mui';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { Tooltip, IconButton } from '@mui/material';
import { useReactFlow } from 'reactflow';

import { useAppStore } from '../../../store/hooks';
import { SavedAppState } from '../../../types';
import { reset } from '../../../store/reducers/board';
import { useAppDispatch } from '../../../store/hooks';
import { Menu } from '../../../components';

const useStyles = makeStyles()(() => ({
  iconButton: {
    padding: 0,
  },
}));

enum FileOption {
  Export,
  Load,
  Share,
}

const fileOptions = [
  { label: 'Экспортировать', value: FileOption.Export },
  { label: 'Загрузить', value: FileOption.Load },
  { label: 'Поделиться', value: FileOption.Export },
];

type FileOptionsProps = {
  className?: string;
};

export const FileOptions: React.FC<FileOptionsProps> = ({ className }) => {
  const { classes, cx } = useStyles();

  const reactFlowInstance = useReactFlow();
  const store = useAppStore();

  const dispatch = useAppDispatch();

  const handleExport = async () => {
    const reactFlowData = reactFlowInstance.toObject();
    const dependencies = store.getState().board.dependencies;

    const dataToSave = JSON.stringify({
      reactFlow: reactFlowData,
      dependencies,
    });

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

  const handleOptionSelect = (option: FileOption) => {
    switch (option) {
      case FileOption.Export:
        handleExport();
        break;
      case FileOption.Load:
        handleLoad();
        break;
      case FileOption.Share:
        break;
      default:
        break;
    }
  };

  return (
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
    ></Menu>
  );
};

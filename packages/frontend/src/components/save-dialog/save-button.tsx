import { Button, lighten } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useReactFlow } from 'reactflow';

import { useAppStore } from '../../store/hooks';
import { SavedAppState } from '../../types';
import { reset } from '../../store/reducers/board';
import { useAppDispatch } from '../../store/hooks';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  button: {
    borderRadius: 5 * theme.shape.borderRadius,
    textTransform: 'none',
    zIndex: theme.zIndex.appBar,
    background: theme.palette.background.default,
    padding: theme.spacing(0.5, 1.5),
    '&:hover': {
      background: lighten(theme.palette.background.default, 0.1),
    },
  },
}));

const fileOptions = {
  types: [
    {
      description: 'Json file',
      accept: { 'application/json': ['.nbda'] },
    },
  ],
};

type SaveButtonProps = {
  className?: string;
};

export const SaveButton: React.FC<SaveButtonProps> = ({ className }) => {
  const { classes, cx } = useStyles();

  const reactFlowInstance = useReactFlow();
  const store = useAppStore();

  const dispatch = useAppDispatch();

  const handleSave = async () => {
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

  return (
    <div className={cx(classes.container, className)}>
      <Button variant="outlined" className={classes.button} onClick={handleSave}>
        Save
      </Button>

      <Button variant="outlined" className={classes.button} onClick={handleLoad}>
        Load
      </Button>
    </div>
  );
};

import { useState, memo } from 'react';
import { NodeProps } from 'reactflow';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch } from '../../../store/hooks';
import { resetNodeData, updateDependents, updateNodeById } from '../../../store/reducers/board';

const useStyles = makeStyles()((theme) => ({
  dropzoneContainer: {
    border: `1px dashed ${theme.palette.primary.dark}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  fileName: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  removeButton: {
    width: 18,
    height: 18,
    '& svg': {
      width: 14,
      height: 14,
    },
  },
}));

type FileLoaderComponentProps = Pick<NodeProps, 'id'>;

export const FileLoaderComponent: React.FC<FileLoaderComponentProps> = memo(({ id }) => {
  const { classes } = useStyles();

  const [fileName, setFileName] = useState<string>('');

  const dispatch = useAppDispatch();

  const handleDrop = (files: File[]) => {
    const [file] = files;
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = () => {
      const { data } = parse<string[]>(fileReader.result as string);
      const [columns, ...rows] = data;

      const tableData = {
        columns,
        data: rows,
      };

      dispatch(updateNodeById({ id, data: { input: tableData } }));
      dispatch(updateDependents(id));
      setFileName(file.name);
    };
  };

  const handleRemoveFile = () => {
    setFileName('');
    dispatch(resetNodeData(id));
    dispatch(updateDependents(id));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: handleDrop,
    maxFiles: 1,
    accept: { 'text/csv': ['.csv'] },
  });

  return (
    <>
      {fileName ? (
        <div className={classes.fileName}>
          {fileName}
          <IconButton className={classes.removeButton} onClick={handleRemoveFile}>
            <CloseIcon />
          </IconButton>
        </div>
      ) : (
        <div className={classes.dropzoneContainer} {...getRootProps()} onMouseDown={(e) => e.stopPropagation()}>
          Drop file here
        </div>
      )}

      <input {...getInputProps()} style={{ display: 'none' }} />
    </>
  );
});

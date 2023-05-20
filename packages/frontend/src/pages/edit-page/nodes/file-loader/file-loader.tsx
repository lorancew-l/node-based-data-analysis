import { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, resetNodeData, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOTableData } from '../../../../types';
import { useReadonlyContext } from '../../readonly-context';

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

type FileLoaderComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOTableData>;
};

export const FileLoaderComponent: React.FC<FileLoaderComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const readonly = useReadonlyContext();

  const { params } = data ?? {};

  const fileName = params?.fileName ?? '';

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

      dispatch(updateNodeById({ id, data: { input: tableData, params: { fileName: file.name } } }));
      dispatch(updateDependents(id));
    };
  };

  const handleRemoveFile = () => {
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
          <IconButton className={classes.removeButton} onClick={handleRemoveFile} disabled={readonly}>
            <CloseIcon />
          </IconButton>
        </div>
      ) : (
        <div className={classes.dropzoneContainer} {...getRootProps()} onMouseDown={(e) => e.stopPropagation()}>
          Выберите файл
        </div>
      )}

      <input {...getInputProps()} style={{ display: 'none' }} />
    </>
  );
});

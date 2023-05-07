import { memo, useState, useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ReactMarkdown from 'react-markdown';

import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData } from '../../../../types';
import { useAppDispatch, removeNode, updateNodeById } from '../../../../store';
import { useReadonlyContext } from '../../readonly-context';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: 300,
    position: 'relative',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  toolbar: {
    position: 'absolute',
    right: 0,
  },
  textarea: {
    padding: theme.spacing(1),
    width: '100%',
    minHeight: 150,
    backgroundColor: theme.palette.common.white,
    border: 'none',
    outline: 'none',
    resize: 'vertical',
  },
  button: {
    borderRadius: 0,
  },
  markdownRenderer: {
    width: 300,
    maxWidth: 300,
  },
}));

const placeholder = 'Enter markdown';

type MarkdownComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOObjectData>;
};

export const MarkdownComponent: React.FC<MarkdownComponentProps> = memo(({ id, data }) => {
  const { cx, classes } = useStyles();

  const readonly = useReadonlyContext();

  const { params } = data;
  const { markdown } = params;

  const inputRef = useRef<HTMLTextAreaElement>();

  const dispatch = useAppDispatch();

  const [isEditModeOn, setIsEditModeOn] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    dispatch(updateNodeById({ id, data: { params: { markdown: value } } }));
  };

  const handleRemove = () => {
    dispatch(removeNode(id));
  };

  const handleEditOn = () => setIsEditModeOn(true);

  const handleBlur = () => setIsEditModeOn(false);

  const handleMouseOver = () => setIsHovered(true);

  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    if (isEditModeOn) {
      inputRef.current?.focus();
    }
  }, [isEditModeOn]);

  return (
    <div className={classes.container} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {isHovered && !isEditModeOn && (
        <span className={classes.toolbar}>
          <IconButton className={classes.button} onClick={handleRemove} disabled={readonly}>
            <CloseIcon />
          </IconButton>

          <IconButton className={classes.button} onClick={handleEditOn} disabled={readonly}>
            <EditIcon />
          </IconButton>
        </span>
      )}

      {isEditModeOn ? (
        <TextareaAutosize
          ref={inputRef}
          placeholder={placeholder}
          className={cx(classes.textarea, 'nodrag')}
          value={markdown}
          onChange={handleTextChange}
          onBlur={handleBlur}
          disabled={readonly}
        />
      ) : (
        <ReactMarkdown className={classes.markdownRenderer}>{markdown || placeholder}</ReactMarkdown>
      )}
    </div>
  );
});

import { memo } from 'react';
import ReactAce from 'react-ace/lib/ace';
import { isEmpty } from 'lodash';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import './object-viewer.css';

type ObjectViewerProps = {
  data: object;
};

export const ObjectViewer: React.FC<ObjectViewerProps> = memo(({ data }) => {
  if (isEmpty(data)) {
    return null;
  }

  return <ReactAce width="100%" height="100%" value={JSON.stringify(data, null, 2)} mode="json" theme="dracula" readOnly />;
});

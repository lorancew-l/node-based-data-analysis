import { useState } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import InputIcon from '@mui/icons-material/Input';
import TransformIcon from '@mui/icons-material/Transform';
import BarChartIcon from '@mui/icons-material/BarChart';
import Grid from '@mui/material/Grid';
import { TextField, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { NodeGroupName, nodeGroupNameToTitle } from '../node-config';
import { NodeCard } from './node-card';
import { SectionName } from './section-name';
import { useGroupedNodes } from './use-grouped-nodes';
import { NodeType } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { addNode } from '../../store/reducers/board';
import { useReactFlow } from 'reactflow';
import { useRendererContext } from '../renderer-context';

const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 'none',
    background: theme.palette.background.default,
  },
  icon: {
    width: 16,
  },
  container: {
    width: 'min(80vw, 1100px)',
    height: '80vh',
    display: 'flex',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '20%',
  },
  sectionNameList: {},
  sectionName: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0.5, 0.5, 0),
    gap: theme.spacing(1),
    cursor: 'pointer',
  },
  sectionNameTitle: {
    textTransform: 'uppercase',
    fontSize: theme.typography.fontSize * 0.9,
  },
  sectionContainer: {
    flexBasis: '80%',
    maxHeight: '100%',
    overflowY: 'scroll',
    padding: theme.spacing(0, 2),
  },
  section: {
    margin: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(1, 0),
  },
}));

type AddBlockDialogProps = Omit<DialogProps, 'onClose'> & {
  onClose(): void;
};

export const AddBlockDialog: React.FC<AddBlockDialogProps> = ({ onClose, ...props }) => {
  const { classes } = useStyles();
  const { project } = useReactFlow();

  const [searchText, setSearchText] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<NodeGroupName>();

  const rendererRef = useRendererContext();

  const groupedNodes = useGroupedNodes({ text: searchText, group: selectedGroup });

  const dispatch = useAppDispatch();

  const handleGroupSelect = (group: NodeGroupName) => {
    setSelectedGroup(group === selectedGroup ? null : group);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleAddNode = (nodeType: NodeType) => {
    const { width, height } = rendererRef.current.getBoundingClientRect();

    dispatch(addNode({ type: nodeType, position: project({ x: width / 2, y: height / 2 }) }));
    onClose();
  };

  return (
    <Dialog PaperProps={{ className: classes.paper }} onClose={onClose} {...props}>
      <DialogContent className={classes.container}>
        <div className={classes.sidebar}>
          <Typography variant="h6">Blocks</Typography>

          <TextField
            className={classes.textField}
            value={searchText}
            onChange={handleSearch}
            size="small"
            placeholder="Search..."
          />

          <div className={classes.sectionNameList}>
            <SectionName name={NodeGroupName.Input} value={selectedGroup} Icon={InputIcon} onClick={handleGroupSelect}>
              Input
            </SectionName>

            <SectionName name={NodeGroupName.Transform} value={selectedGroup} Icon={TransformIcon} onClick={handleGroupSelect}>
              Transform
            </SectionName>

            <SectionName name={NodeGroupName.Visualize} value={selectedGroup} Icon={BarChartIcon} onClick={handleGroupSelect}>
              Visualize
            </SectionName>
          </div>
        </div>

        <div className={classes.sectionContainer}>
          {Object.entries(groupedNodes).map(([groupName, groupContent]) => (
            <div key={groupName} className={classes.section}>
              <Typography className={classes.sectionTitle}>{nodeGroupNameToTitle[groupName as NodeGroupName]}</Typography>

              <Grid spacing={2} container>
                {groupContent.map((nodeInfo) => (
                  <Grid key={nodeInfo.type} xs={4} item>
                    <NodeCard onClick={handleAddNode} {...nodeInfo} />
                  </Grid>
                ))}
              </Grid>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Card, CardContent, TextField, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { NodeType } from '../../../types';

import { NodeConfigItem } from '../../../components/node-config';

const useStyles = makeStyles()((theme) => ({
  card: {
    cursor: 'pointer',
    height: 160,
    transition: '0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
  description: {
    fontSize: 1 * theme.typography.fontSize,
  },
  inputOutputInfo: {
    fontSize: 1 * theme.typography.fontSize,
  },
}));

type NodeCardProps = NodeConfigItem & {
  onClick(nodeType: NodeType): void;
};

export const NodeCard: React.FC<NodeCardProps> = ({ title, description, input, output, type, onClick }) => {
  const { classes } = useStyles();

  const handleClick = () => onClick(type);

  return (
    <Card className={classes.card} onClick={handleClick}>
      <CardContent className={classes.content}>
        <div>
          <Typography className={classes.title} color="text.primary">
            {title}
          </Typography>

          <Typography variant="body2" className={classes.description} color="text.secondary">
            {description}
          </Typography>
        </div>

        <div>
          <Typography className={classes.inputOutputInfo} color="action.disabled">{`Input: ${input.join()}`}</Typography>
          <Typography className={classes.inputOutputInfo} color="action.disabled">{`Output: ${output.join()}`}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

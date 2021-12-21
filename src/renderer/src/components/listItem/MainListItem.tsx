import { useEffect, useState } from 'react';
import {
  ButtonBase,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import ArrowDownOutlineIcon from '../icons/ArrowDownOutlineIcon';

interface MainListItemProps {
  item: string;
  index: number;
}

const MainListItem: React.FC<MainListItemProps> = (props: MainListItemProps) => {
  const { item, index } = props;

  const theme = useTheme();

  const [hasAction, setHasAction] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(true);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress: number) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.floor(Math.random() * 10);
        return Math.min(oldProgress + diff, 100);
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <ListItem>
      <ListItemButton
        disableRipple
        sx={{
          width: '100%',
          backgroundColor: index % 2 === 0 ? theme.palette.grey[50] : 'transparent',
        }}
        onMouseOver={() => setHasAction(true)}
        onMouseOut={() => setHasAction(false)}
      >
        <ListItemText>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              noWrap
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-all',
                color: theme.palette.grey[800],
              }}
            >
              {item}
            </Typography>
            <ButtonBase
              disableRipple
              sx={{
                display: hasAction ? 'flex' : 'none',
                marginLeft: theme.spacing(1),
              }}
              onClick={() => setIsDownload(!isDownload)}
            >
              {isDownload ? (
                <PauseIcon sx={{ fontSize: 16 }} color="primary" />
              ) : (
                <PlayIcon sx={{ fontSize: 16 }} color="primary" />
              )}
            </ButtonBase>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" sx={{ width: '320px' }}>
                <LinearProgress
                  sx={{ width: 96, borderRadius: theme.shape.borderRadius }}
                  variant="determinate"
                  value={progress}
                />
                <Typography variant="caption" sx={{ marginLeft: 1, color: theme.palette.text.secondary }}>
                  {progress}MB / 100MB
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <ArrowDownOutlineIcon sx={{ fontSize: 12 }} color="warning" />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {progress}MB/s
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              00:{progress}:00
            </Typography>
          </Stack>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default MainListItem;

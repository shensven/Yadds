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
import IonPlay from '../icons/IonPlay';
import IonPause from '../icons/IonPause';
import IonArrowDownC from '../icons/IonArrowDownC';

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
          backgroundColor: index % 2 === 0 ? theme.palette.card.default : 'transparent',
        }}
        onMouseOver={() => setHasAction(true)}
        onMouseOut={() => setHasAction(false)}
      >
        <ListItemText>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography noWrap sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {item}
            </Typography>
            <ButtonBase
              disableRipple
              sx={{ ml: theme.spacing(1), display: hasAction ? 'flex' : 'none' }}
              onClick={() => setIsDownload(!isDownload)}
            >
              {isDownload ? (
                <IonPause sx={{ fontSize: 16 }} color="primary" />
              ) : (
                <IonPlay sx={{ fontSize: 16 }} color="primary" />
              )}
            </ButtonBase>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" sx={{ width: '300px' }}>
                <LinearProgress
                  sx={{ width: 96, borderRadius: theme.shape.borderRadius }}
                  variant="determinate"
                  value={progress}
                />
                <Typography sx={{ fontSize: 12, ml: 1, color: theme.palette.text.disabled }}>
                  {progress}MB / 100MB
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <IonArrowDownC sx={{ fontSize: 12 }} color="warning" />
                <Typography sx={{ fontSize: 12, color: theme.palette.text.disabled }}>{progress}MB/s</Typography>
              </Stack>
            </Stack>
            <Typography sx={{ fontSize: 12, color: theme.palette.text.disabled }}>00:{progress}:00</Typography>
          </Stack>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default MainListItem;

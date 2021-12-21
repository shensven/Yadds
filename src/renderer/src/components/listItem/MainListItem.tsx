import { useEffect, useState } from 'react';
import { Box, LinearProgress, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import ArrowDownOutlineIcon from '../icons/ArrowDownOutlineIcon';

interface MainListItemProps {
  item: string;
  index: number;
}

const MainListItem: React.FC<MainListItemProps> = (props: MainListItemProps) => {
  const { item, index } = props;

  const theme = useTheme();

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
      <ListItemButton sx={{ width: '100%', backgroundColor: index % 2 === 0 ? theme.palette.grey[50] : 'none' }}>
        <ListItemText>
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
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing(1) }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '320px' }}>
                <LinearProgress
                  sx={{ width: 96, borderRadius: theme.shape.borderRadius }}
                  variant="determinate"
                  value={progress}
                />
                <Typography variant="caption" sx={{ marginLeft: 1, color: theme.palette.text.secondary }}>
                  {progress}MB / 100MB
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowDownOutlineIcon sx={{ fontSize: 12 }} color="warning" />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {progress}MB/s
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              00:{progress}:00
            </Typography>
          </Box>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default MainListItem;

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import DRAWER_WIDTH from '../context/drawerWidth';
import ShapesOutlineIcon from '../components/icons/ShapesOutlineIcon';
import ArrowDownCircleOutlineIcon from '../components/icons/ArrowDownCircleOutlineIcon';
import CheckmarkCircleOutlineIcon from '../components/icons/CheckmarkCircleOutlineIcon';
import ArrowUpCircleOutlineIcon from '../components/icons/ArrowUpCircleOutlineIcon';
import CloseCircleOutlineIcon from '../components/icons/CloseCircleOutlineIcon';
import StopCircleOutlineIcon from '../components/icons/StopCircleOutlineIcon';
import CogOutlineIcon from '../components/icons/CogOutlineIcon';

interface Category {
  path: string;
  name: string;
  icon: JSX.Element;
}

const YaddsDrawer: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { hasYaddsDrawer, yaddsDrawerCategory, setYaddsDrawerCategory } = useContext(YaddsCtx);

  const category: Category[] = [
    { path: '/queueAll', name: '全部下载项目', icon: <ShapesOutlineIcon /> },
    { path: '/queueDownloading', name: '下载中', icon: <ArrowDownCircleOutlineIcon /> },
    { path: '/queueFinished', name: '已完成', icon: <CheckmarkCircleOutlineIcon /> },
    { path: '/queueActive', name: '进行中', icon: <ArrowUpCircleOutlineIcon /> },
    { path: '/queueInactive', name: '非进行中', icon: <CloseCircleOutlineIcon /> },
    { path: '/queueStopped', name: '停用', icon: <StopCircleOutlineIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
      open={hasYaddsDrawer}
    >
      <List>
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
              dense
              disableRipple
              // selected={yaddsDrawerCategory === item.path}
              onClick={() => {
                setYaddsDrawerCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    noWrap
                    style={{
                      fontWeight: yaddsDrawerCategory === item.path ? 600 : 400,
                      color: yaddsDrawerCategory === item.path ? theme.palette.primary.main : theme.palette.grey[800],
                    }}
                  >
                    {item.name}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem>
          <ListItemButton
            dense
            disableRipple
            // selected={yaddsDrawerCategory === 'settings'}
            sx={{ width: '100%' }}
            onClick={() => {
              setYaddsDrawerCategory('settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon>
              <CogOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  noWrap
                  style={{
                    fontWeight: yaddsDrawerCategory === 'settings' ? 600 : 400,
                    color: yaddsDrawerCategory === 'settings' ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                >
                  设置
                </Typography>
              }
              secondary={
                <Typography noWrap sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                  192.168.100.2 - Lina
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default YaddsDrawer;

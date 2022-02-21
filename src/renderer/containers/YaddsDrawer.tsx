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
import IonShapesOutline from '../components/icons/IonShapesOutline';
import IonShapes from '../components/icons/IonShapes';
import IonArrowDownCircleOutline from '../components/icons/IonArrowDownCircleOutline';
import IonArrowDownCircle from '../components/icons/IonArrowDownCircle';
import IonCheckmarkCircleOutline from '../components/icons/IonCheckmarkCircleOutline';
import IonCheckmarkCircle from '../components/icons/IonCheckmarkCircle';
import IonArrowUpCircleOutline from '../components/icons/IonArrowUpCircleOutline';
import IonArrowUpCircle from '../components/icons/IonArrowUpCircle';
import IonCloseCircleOutline from '../components/icons/IonCloseCircleOutline';
import IonCloseCircle from '../components/icons/IonCloseCircle';
import IonStopCircleOutline from '../components/icons/IonStopCircleOutline';
import IonStopCircle from '../components/icons/IonStopCircle';
import IonCogOutline from '../components/icons/IonCogOutline';
import IonCog from '../components/icons/IonCog';

interface Category {
  path: string;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const YaddsDrawer: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { hasYaddsDrawer, yaddsDrawerCategory, setYaddsDrawerCategory } = useContext(YaddsCtx);

  const category: Category[] = [
    { path: '/queueAll', name: '全部下载项目', activeIcon: <IonShapes />, inactiveIcon: <IonShapesOutline /> },
    {
      path: '/queueDownloading',
      name: '下载中',
      activeIcon: <IonArrowDownCircle />,
      inactiveIcon: <IonArrowDownCircleOutline />,
    },
    {
      path: '/queueFinished',
      name: '已完成',
      activeIcon: <IonCheckmarkCircle />,
      inactiveIcon: <IonCheckmarkCircleOutline />,
    },
    {
      path: '/queueActive',
      name: '进行中',
      activeIcon: <IonArrowUpCircle />,
      inactiveIcon: <IonArrowUpCircleOutline />,
    },
    {
      path: '/queueInactive',
      name: '非进行中',
      activeIcon: <IonCloseCircle />,
      inactiveIcon: <IonCloseCircleOutline />,
    },
    {
      path: '/queueStopped',
      name: '停用',
      activeIcon: <IonStopCircle />,
      inactiveIcon: <IonStopCircleOutline />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': {
          backgroundColor: 'transparent',
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
      open={hasYaddsDrawer}
    >
      <List sx={{ mt: window.electron.getOS() === 'darwin' ? theme.spacing(4) : 0 }}>
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
              dense
              disableRipple
              selected={yaddsDrawerCategory === item.path}
              onClick={() => {
                setYaddsDrawerCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon>{yaddsDrawerCategory === item.path ? item.activeIcon : item.inactiveIcon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
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
            selected={yaddsDrawerCategory === '/settings'}
            sx={{ width: '100%' }}
            onClick={() => {
              setYaddsDrawerCategory('/settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon>{yaddsDrawerCategory === '/settings' ? <IonCog /> : <IonCogOutline />}</ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  noWrap
                  style={{
                    fontWeight: yaddsDrawerCategory === '/settings' ? 600 : 400,
                    color:
                      yaddsDrawerCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary,
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

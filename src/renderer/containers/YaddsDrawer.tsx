import { useContext, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const { hasYaddsDrawer, yaddsDrawerCategory, persistYaddsDrawerCategory } = useContext(YaddsCtx);
  useLayoutEffect(() => {
    window.electron?.navigateTo(navigate, persistYaddsDrawerCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const category: Category[] = [
    {
      path: '/queueAll',
      name: t('drawer.all'),
      activeIcon: <IonShapes />,
      inactiveIcon: <IonShapesOutline />,
    },
    {
      path: '/queueDownloading',
      name: t('drawer.downloading'),
      activeIcon: <IonArrowDownCircle />,
      inactiveIcon: <IonArrowDownCircleOutline />,
    },
    {
      path: '/queueFinished',
      name: t('drawer.completed'),
      activeIcon: <IonCheckmarkCircle />,
      inactiveIcon: <IonCheckmarkCircleOutline />,
    },
    {
      path: '/queueActive',
      name: t('drawer.active'),
      activeIcon: <IonArrowUpCircle />,
      inactiveIcon: <IonArrowUpCircleOutline />,
    },
    {
      path: '/queueInactive',
      name: t('drawer.inactive'),
      activeIcon: <IonCloseCircle />,
      inactiveIcon: <IonCloseCircleOutline />,
    },
    {
      path: '/queueStopped',
      name: t('drawer.stopped'),
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
      <List
        sx={{
          [(window.electron?.getOS() === 'darwin' && 'mt') as string]: theme.spacing(4),
        }}
      >
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
              dense
              disableRipple
              selected={yaddsDrawerCategory === item.path}
              onClick={() => {
                persistYaddsDrawerCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                {yaddsDrawerCategory === item.path ? item.activeIcon : item.inactiveIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    style={{
                      fontWeight: 500,
                      color:
                        yaddsDrawerCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
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
            onClick={() => {
              persistYaddsDrawerCategory('/settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              {yaddsDrawerCategory === '/settings' ? <IonCog /> : <IonCogOutline />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  noWrap
                  style={{
                    fontWeight: 500,
                    color:
                      yaddsDrawerCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                >
                  {t('drawer.settings')}
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

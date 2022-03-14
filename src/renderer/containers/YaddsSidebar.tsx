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
import SIDEBAR_WIDTH from '../context/sidebarWidth';
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
import menuItemLabelHandler from '../utils/menuItemLabelHandler';

interface Category {
  path: string;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const YaddsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    hasYaddsSidebar,
    hasYaddsSidebarMarginTop,
    setHasYaddsSidebarMarginTop,
    yaddsSidebarCategory,
    persistYaddsSidebarCategory,
  } = useContext(YaddsCtx);

  const isDarwin = window.electron?.getOS() === 'darwin';

  useLayoutEffect(() => {
    window.electron?.navigateTo(navigate, persistYaddsSidebarCategory); // Init navigation from the top menu
  }, []);

  useLayoutEffect(() => {
    window.electron?.toogleSidebarMarginTop(hasYaddsSidebarMarginTop, setHasYaddsSidebarMarginTop); // handle the margin top of the sidebar
    window.electron?.setApplicationMenu(menuItemLabelHandler(t, hasYaddsSidebar, hasYaddsSidebarMarginTop)); // Init or update application menu
  }, [hasYaddsSidebarMarginTop]);

  const category: Category[] = [
    {
      path: '/queueAll',
      name: t('sidebar.all'),
      activeIcon: <IonShapes />,
      inactiveIcon: <IonShapesOutline />,
    },
    {
      path: '/queueDownloading',
      name: t('sidebar.downloading'),
      activeIcon: <IonArrowDownCircle />,
      inactiveIcon: <IonArrowDownCircleOutline />,
    },
    {
      path: '/queueFinished',
      name: t('sidebar.completed'),
      activeIcon: <IonCheckmarkCircle />,
      inactiveIcon: <IonCheckmarkCircleOutline />,
    },
    {
      path: '/queueActive',
      name: t('sidebar.active'),
      activeIcon: <IonArrowUpCircle />,
      inactiveIcon: <IonArrowUpCircleOutline />,
    },
    {
      path: '/queueInactive',
      name: t('sidebar.inactive'),
      activeIcon: <IonCloseCircle />,
      inactiveIcon: <IonCloseCircleOutline />,
    },
    {
      path: '/queueStopped',
      name: t('sidebar.stopped'),
      activeIcon: <IonStopCircle />,
      inactiveIcon: <IonStopCircleOutline />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: SIDEBAR_WIDTH,
        '& .MuiDrawer-paper': {
          backgroundColor: 'transparent',
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
        },
      }}
      open={hasYaddsSidebar}
    >
      <List
        sx={{
          [(isDarwin && 'mt') as string]: 0,
          ...(hasYaddsSidebarMarginTop && {
            [(isDarwin && 'mt') as string]: theme.spacing(3),
          }),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
              dense
              disableRipple
              selected={yaddsSidebarCategory === item.path}
              onClick={() => {
                persistYaddsSidebarCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                {yaddsSidebarCategory === item.path ? item.activeIcon : item.inactiveIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    style={{
                      fontWeight: 500,
                      color:
                        yaddsSidebarCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
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
            selected={yaddsSidebarCategory === '/settings'}
            onClick={() => {
              persistYaddsSidebarCategory('/settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              {yaddsSidebarCategory === '/settings' ? <IonCog /> : <IonCogOutline />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  noWrap
                  style={{
                    fontWeight: 500,
                    color:
                      yaddsSidebarCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                >
                  {t('sidebar.settings')}
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

export default YaddsSidebar;

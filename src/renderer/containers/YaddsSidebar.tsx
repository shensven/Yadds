import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useAtom } from 'jotai';
import { atomOS, atomSidebarWidth } from '../atoms/atomConstant';
import {
  atomHasSidebarMarginTop,
  atomPersistenceHasSidebar,
  SidebarCategory,
  atomPersistenceSidebarCategory,
} from '../atoms/atomUI';
import { atomTasks } from '../atoms/atomTask';
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
import IonServerOutline from '../components/icons/IonServerOutline';
import IonServer from '../components/icons/IonServer';
import IonCogOutline from '../components/icons/IonCogOutline';
import IonCog from '../components/icons/IonCog';
import useMenuInApp from '../utils/useMenuInApp';

interface YaddsCategoryObj {
  path: SidebarCategory;
  tasksLength: number;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const YaddsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [SIDEBAR_WIDTH] = useAtom(atomSidebarWidth);
  const [hasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [hasSidebarMarginTop, setHasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);
  const [sidebarCategory, setSidebarCategory] = useAtom(atomPersistenceSidebarCategory);
  const [tasks] = useAtom(atomTasks);

  const { menuItems: menuItemsInApp } = useMenuInApp();

  useEffect(() => {
    window.electron?.yadds.navigate(navigate, setSidebarCategory); // Init navigation from the top menu
  }, []);

  useEffect(() => {
    window.electron?.yadds.toogleSidebarMarginTop(setHasSidebarMarginTop); // handle the margin top of the sidebar
    window.electron?.topMenuForApp.create(menuItemsInApp); // Init or update application menu
  }, [hasSidebarMarginTop]);

  const categoryList: YaddsCategoryObj[] = [
    {
      path: '/queueAll',
      tasksLength: tasks.length,
      name: t('sidebar.all'),
      activeIcon: <IonShapes sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonShapesOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueDownloading',
      tasksLength: tasks.filter((task) => task.status === 2).length,
      name: t('sidebar.downloading'),
      activeIcon: <IonArrowDownCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonArrowDownCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueFinished',
      tasksLength: tasks.filter((task) => task.status === 'finished' || task.status === 5).length,
      name: t('sidebar.completed'),
      activeIcon: <IonCheckmarkCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonCheckmarkCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueActive',
      tasksLength: tasks.filter((task) => task.status === 2 || task.status === 8).length,
      name: t('sidebar.active'),
      activeIcon: <IonArrowUpCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonArrowUpCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueInactive',
      tasksLength: tasks.filter((task) => task.status === 3).length,
      name: t('sidebar.inactive'),
      activeIcon: <IonCloseCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonCloseCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueStopped',
      tasksLength: tasks.filter((task) => task.status === 3).length,
      name: t('sidebar.stopped'),
      activeIcon: <IonStopCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonStopCircleOutline sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={hasSidebar}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: 'transparent',
          width: SIDEBAR_WIDTH,
        },
      }}
    >
      <List
        dense
        sx={{
          mt: theme.spacing(1),
          ...(hasSidebarMarginTop && {
            [(OS_PLATFORM === 'darwin' && 'mt') as string]: theme.spacing(4),
          }),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        {categoryList.map((item) => (
          <ListItem key={item.path}>
            <ListItemButton
              disableRipple
              selected={sidebarCategory === item.path}
              onClick={() => {
                setSidebarCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: theme.spacing(4),
                  color: sidebarCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {sidebarCategory === item.path ? item.activeIcon : item.inactiveIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    noWrap
                    variant="subtitle2"
                    component="p"
                    color={sidebarCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary}
                    fontWeight={600}
                    sx={{ mr: theme.spacing(0.5) }}
                  >
                    {item.name}
                  </Typography>
                }
              />
              {item.tasksLength > 0 && (
                <Typography
                  variant="caption"
                  fontWeight={500}
                  color={theme.palette.card.default}
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    backgroundColor: theme.palette.text.disabled,
                    px: theme.spacing(0.5),
                    minWidth: theme.spacing(3),
                    textAlign: 'center',
                    borderRadius: 0.6,
                  }}
                >
                  {item.tasksLength >= 100 ? '99+' : item.tasksLength}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider light sx={{ mx: theme.spacing(2), my: theme.spacing(1) }} />
        <ListItem>
          <ListItemButton
            disableRipple
            selected={sidebarCategory === '/server'}
            sx={{ width: '100%' }}
            onClick={() => {
              setSidebarCategory('/server');
              navigate('/server');
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: theme.spacing(4),
                color: sidebarCategory === '/server' ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            >
              {sidebarCategory === '/server' ? (
                <IonServer sx={{ fontSize: 20 }} />
              ) : (
                <IonServerOutline sx={{ fontSize: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  // noWrap
                  variant="subtitle2"
                  color={sidebarCategory === '/server' ? theme.palette.primary.main : theme.palette.text.secondary}
                  fontWeight={600}
                >
                  {t('sidebar.server')}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <ListItemButton
            disableRipple
            selected={sidebarCategory === '/settings'}
            sx={{ width: '100%' }}
            onClick={() => {
              setSidebarCategory('/settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: theme.spacing(4),
                color: sidebarCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary,
              }}
            >
              {sidebarCategory === '/settings' ? (
                <IonCog sx={{ fontSize: 20 }} />
              ) : (
                <IonCogOutline sx={{ fontSize: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  noWrap
                  variant="subtitle2"
                  color={sidebarCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary}
                  fontWeight={600}
                >
                  {t('sidebar.settings')}
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

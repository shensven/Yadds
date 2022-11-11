import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { atomOS, atomSidebarWidth } from '@/renderer/atoms/atomConstant';
import {
  atomHasSidebarMarginTop,
  atomPersistenceHasSidebar,
  SidebarCategory,
  atomPersistenceSidebarCategory,
} from '@/renderer/atoms/atomUI';
import { atomTasks } from '@/renderer/atoms/atomTask';
import useNav from '@/renderer/utils/useNav';
import IonShapesOutline from '@/renderer/assets/icons/IonShapesOutline';
import IonShapes from '@/renderer/assets/icons/IonShapes';
import IonArrowDownCircleOutline from '@/renderer/assets/icons/IonArrowDownCircleOutline';
import IonArrowDownCircle from '@/renderer/assets/icons/IonArrowDownCircle';
import IonCheckmarkCircleOutline from '@/renderer/assets/icons/IonCheckmarkCircleOutline';
import IonCheckmarkCircle from '@/renderer/assets/icons/IonCheckmarkCircle';
import IonArrowUpCircleOutline from '@/renderer/assets/icons/IonArrowUpCircleOutline';
import IonArrowUpCircle from '@/renderer/assets/icons/IonArrowUpCircle';
import IonCloseCircleOutline from '@/renderer/assets/icons/IonCloseCircleOutline';
import IonCloseCircle from '@/renderer/assets/icons/IonCloseCircle';
import IonStopCircleOutline from '@/renderer/assets/icons/IonStopCircleOutline';
import IonStopCircle from '@/renderer/assets/icons/IonStopCircle';
import IonServerOutline from '@/renderer/assets/icons/IonServerOutline';
import IonServer from '@/renderer/assets/icons/IonServer';
import IonCogOutline from '@/renderer/assets/icons/IonCogOutline';
import IonCog from '@/renderer/assets/icons/IonCog';

interface YaddsCategoryObj {
  path: SidebarCategory;
  tasksLength: number;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const YaddsSidebar: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { navigate } = useNav();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [SIDEBAR_WIDTH] = useAtom(atomSidebarWidth);

  const [hasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [hasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);
  const [sidebarCategory] = useAtom(atomPersistenceSidebarCategory);

  const [tasks] = useAtom(atomTasks);

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
      sx={{ '& .MuiDrawer-paper': { backgroundColor: 'transparent', width: SIDEBAR_WIDTH } }}
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
            <ListItemButton disableRipple selected={sidebarCategory === item.path} onClick={() => navigate(item.path)}>
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
            onClick={() => navigate('/server')}
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
                  noWrap
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
            selected={sidebarCategory === '/preferences'}
            sx={{ width: '100%' }}
            onClick={() => navigate('/preferences')}
          >
            <ListItemIcon
              sx={{
                minWidth: theme.spacing(4),
                color: sidebarCategory === '/preferences' ? theme.palette.primary.main : theme.palette.text.primary,
              }}
            >
              {sidebarCategory === '/preferences' ? (
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
                  color={sidebarCategory === '/preferences' ? theme.palette.primary.main : theme.palette.text.primary}
                  fontWeight={600}
                >
                  {t('sidebar.preferences')}
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

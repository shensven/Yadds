import { useEffect } from 'react';
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
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { useAtom } from 'jotai';
import {
  dsmConnectIndexAtomWithPersistence,
  dsmConnectListAtomWithPersistence,
  hasYaddsSidebarAtomWithPersistence,
  hasYaddsSidebarMarginTopAtom,
  sidebarWidth,
  tasksAtom,
  tasksRetry,
  tasksStatusAtom,
  yaddsSidebarCategoryAtomWithPersistence,
} from '../atoms/yaddsAtoms';
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
import EosIconsThreeDotsLoading from '../components/icons/EosIconsThreeDotsLoading';
import IcRoundLink from '../components/icons/IcRoundLink';
import IcRoundLinkOff from '../components/icons/IcRoundLinkOff';
import IonCog from '../components/icons/IonCog';
import appMenuItemHandler from '../utils/appMenuItemHandler';

interface Category {
  path: string;
  tasksLength: number;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

const YaddsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const [SIDEBAR_WIDTH] = useAtom(sidebarWidth);
  const [TASKS_RETRY] = useAtom(tasksRetry);
  const [hasYaddsSidebar] = useAtom(hasYaddsSidebarAtomWithPersistence);
  const [hasYaddsSidebarMarginTop, setHasYaddsSidebarMarginTop] = useAtom(hasYaddsSidebarMarginTopAtom);
  const [yaddsSidebarCategory, persistYaddsSidebarCategory] = useAtom(yaddsSidebarCategoryAtomWithPersistence);
  const [dsmConnectList] = useAtom(dsmConnectListAtomWithPersistence);
  const [dsmConnectIndex] = useAtom(dsmConnectIndexAtomWithPersistence);
  const [tasks] = useAtom(tasksAtom);
  const [tasksStatus, setTasksStatus] = useAtom(tasksStatusAtom);

  const isDarwin = window.electron?.getOS() === 'darwin';

  useEffect(() => {
    window.electron?.navigateTo(navigate, persistYaddsSidebarCategory); // Init navigation from the top menu
  }, []);

  useEffect(() => {
    window.electron?.toogleSidebarMarginTop(hasYaddsSidebarMarginTop, setHasYaddsSidebarMarginTop); // handle the margin top of the sidebar

    const appMenuItemLabel = appMenuItemHandler(t, hasYaddsSidebar, hasYaddsSidebarMarginTop);
    window.electron?.setApplicationMenu(appMenuItemLabel); // Init or update application menu
  }, [hasYaddsSidebarMarginTop]);

  const category: Category[] = [
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
      open={hasYaddsSidebar}
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
          [(isDarwin && 'mt') as string]: 0,
          ...(hasYaddsSidebarMarginTop && {
            [(isDarwin && 'mt') as string]: theme.spacing(4),
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
              disableRipple
              selected={yaddsSidebarCategory === item.path}
              onClick={() => {
                persistYaddsSidebarCategory(item.path);
                navigate(item.path);
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: theme.spacing(4),
                  color: yaddsSidebarCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {yaddsSidebarCategory === item.path ? item.activeIcon : item.inactiveIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    noWrap
                    variant="subtitle2"
                    component="p"
                    color={
                      yaddsSidebarCategory === item.path ? theme.palette.primary.main : theme.palette.text.secondary
                    }
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
      </List>
      <List>
        <ListItem>
          <Stack flexDirection="row" width="100%" pl={theme.spacing(2)}>
            <ListItemText
              primary={
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    noWrap
                    variant="overline"
                    component="p"
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    {dsmConnectList[dsmConnectIndex]?.quickConnectID ?? 'null'}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={tasksStatus.isLoading || tasksStatus.retry === 0}
                    onClick={() => setTasksStatus({ ...tasksStatus, isLoading: true, retry: 0 })}
                  >
                    {tasksStatus.isLoading && <EosIconsThreeDotsLoading sx={{ fontSize: 20 }} />}
                    {!tasksStatus.isLoading && tasksStatus.retry === 0 && (
                      <IcRoundLink color="success" sx={{ fontSize: 20 }} />
                    )}
                    {!tasksStatus.isLoading && tasksStatus.retry >= TASKS_RETRY && (
                      <IcRoundLinkOff color="warning" sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Stack>
              }
              // secondary={
              //   <Typography
              //     noWrap
              //     variant="overline"
              //     component="p"
              //     fontWeight={600}
              //     color={theme.palette.text.secondary}
              //   >
              //     {dsmConnectList[dsmConnectIndex]?.username ?? 'null'}
              //   </Typography>
              // }
            />
          </Stack>
        </ListItem>
        <Divider light sx={{ mb: theme.spacing(1) }} />
        <ListItem>
          <ListItemButton
            disableRipple
            selected={yaddsSidebarCategory === '/settings'}
            sx={{ width: '100%' }}
            onClick={() => {
              persistYaddsSidebarCategory('/settings');
              navigate('/settings');
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: theme.spacing(4),
                color: yaddsSidebarCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary,
              }}
            >
              {yaddsSidebarCategory === '/settings' ? (
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
                  color={yaddsSidebarCategory === '/settings' ? theme.palette.primary.main : theme.palette.text.primary}
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

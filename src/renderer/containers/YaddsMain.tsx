import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai';
import { atomOS, atomSidebarWidth } from '../atoms/atomConstant';
import {
  atomHasSidebarMarginTop,
  atomPersistenceHasSidebar,
  atomPersistenceSidebarCategory,
  atomPersistenceQueueIterater,
  atomPersistenceQueueIsAscend,
} from '../atoms/atomUI';
import IcRoundFilterList from '../components/icons/IcRoundFilterList';
import IonEllipsisHorizontal from '../components/icons/IonEllipsisHorizontal';
import greyInactiveSvg from './assets/grey_inactive.svg';
import greyActiveLeftSvg from './assets/grey_active_left.svg';
import greyActiveRightSvg from './assets/grey_active_right.svg';
import RedirectEl from '../pages/RedirectEl';
import QueueAll from '../pages/QueueAll';
import QueueDownloading from '../pages/QueueDownloading';
import QueueFinished from '../pages/QueueFinished';
import QueueActive from '../pages/QueueActive';
import QueueInactive from '../pages/QueueInactive';
import QueueStopped from '../pages/QueueStopped';
import Server from '../pages/Server';
import Settings from '../pages/Settings';
import createMenuItemLabelsForApp from '../utils/createMenuItemLabelsForApp';
import useMenuInTray from '../utils/useMenuInTray';
import createMenuItemLabelsForQueue from '../utils/createMenuItemLabelsForQueue';

const YaddsMain: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);
  const [SIDEBAR_WIDTH] = useAtom(atomSidebarWidth);
  const [sidebarCategory] = useAtom(atomPersistenceSidebarCategory);
  const [hasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);
  const [hasSidebar, setHasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [queueIterater, setQueueIterater] = useAtom(atomPersistenceQueueIterater);
  const [queueIsAscend, setQueueIsAscend] = useAtom(atomPersistenceQueueIsAscend);

  const { menuItems } = useMenuInTray();

  const [indicatorSrc, setIndicatorScr] = useState<string>(greyInactiveSvg);

  useEffect(() => {
    window.electron?.contextMenuForTray.create(menuItems); // Init system tary
    window.electron?.queue.orderBy(setQueueIterater); // Init the sorting iterater of the main page list
    window.electron?.queue.isAscend(setQueueIsAscend); // Init the ascend/descend of the main page list
  }, []);

  useEffect(() => {
    window.electron?.yadds.toogleSidebar(hasSidebar, setHasSidebar); // handle the sidebar state
    const itemLabels = createMenuItemLabelsForApp(t, hasSidebar, hasSidebarMarginTop);
    window.electron?.topMenuForApp.create(itemLabels); // Init or update application menu
  }, [hasSidebar]);

  return (
    <Paper
      square
      elevation={0}
      sx={{
        position: 'fixed',
        right: 0,
        width: '100%',
        height: '100%',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(hasSidebar && {
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }}
    >
      <Box sx={{ position: 'fixed', top: '47%' }}>
        <Icon
          sx={{ height: 40 }}
          onMouseOver={() => setIndicatorScr(hasSidebar ? greyActiveLeftSvg : greyActiveRightSvg)}
          onMouseOut={() => setIndicatorScr(greyInactiveSvg)}
          onClick={() => setHasSidebar(!hasSidebar)}
        >
          <img src={indicatorSrc} alt="" draggable="false" />
        </Icon>
      </Box>
      <AppBar
        elevation={0}
        sx={{
          appRegion: 'drag',
          position: 'sticky',
          flexDirection: 'column',
          backgroundColor: 'transparent',
          display: ['/server', '/settings'].includes(sidebarCategory) ? 'none' : 'flex',
        }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.app.zoomWindow()}
      >
        <Stack flexDirection="row" justifyContent="flex-end" alignItems="center" sx={{ p: theme.spacing(2) }}>
          <Stack
            flexDirection="row"
            alignItems="center"
            alignSelf="stretch"
            sx={{
              appRegion: 'no-drag',
              mr: theme.spacing(6),
              borderRadius: 1,
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
          >
            <IcRoundFilterList sx={{ fontSize: 14, color: theme.palette.grey[500], mx: theme.spacing(1) }} />
            <InputBase
              spellCheck={false}
              size="small"
              placeholder={t('main.filter')}
              sx={{
                fontSize: 12,
                color: theme.palette.text.primary,
                '& .MuiInputBase-input': {
                  p: 0,
                  transition: theme.transitions.create('width'),
                  width: 120,
                  '&:focus': { width: 160 },
                },
              }}
            />
          </Stack>
          <Button
            size="small"
            sx={{
              appRegion: 'no-drag',
              alignSelf: 'stretch',
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
              mr: theme.spacing(2),
            }}
          >
            <Typography fontWeight={500} sx={{ fontSize: 12, lineHeight: 'normal', px: theme.spacing(0.5) }}>
              {t('main.new_task')}
            </Typography>
          </Button>
          <IconButton
            color="primary"
            size="small"
            sx={{
              appRegion: 'no-drag',
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={() => {
              const itemLabels = createMenuItemLabelsForQueue(t, queueIterater, queueIsAscend);
              window.electron.contextMenuForQueue.create(itemLabels);
            }}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 14 }} color="primary" />
          </IconButton>
        </Stack>
      </AppBar>
      <Box
        sx={{
          px: theme.spacing(3),
          overflowY: ['/settings', '/server'].includes(sidebarCategory) ? 'hidden' : 'scroll',
          height: ['/settings', '/server'].includes(sidebarCategory)
            ? '100%'
            : `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        }}
      >
        <Routes>
          <Route path="/" element={<RedirectEl />} />
          <Route path="/queueAll" element={<QueueAll />} />
          <Route path="/queueDownloading" element={<QueueDownloading />} />
          <Route path="/queueFinished" element={<QueueFinished />} />
          <Route path="/queueActive" element={<QueueActive />} />
          <Route path="/queueInactive" element={<QueueInactive />} />
          <Route path="/queueStopped" element={<QueueStopped />} />
          <Route path="/server" element={<Server />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Paper>
  );
};

export default YaddsMain;

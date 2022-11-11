import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { AppBar, Box, Button, Icon, IconButton, InputBase, Paper, Stack, Typography, useTheme } from '@mui/material';
import { atomSidebarWidth } from '@/renderer/atoms/atomConstant';
import { atomPersistenceHasSidebar, atomPersistenceSidebarCategory } from '@/renderer/atoms/atomUI';
import { atomPersistenceTargetDid } from '@/renderer/atoms/atomConnectedUsers';
import IcRoundFilterList from '@/renderer/assets/icons/IcRoundFilterList';
import IonEllipsisHorizontal from '@/renderer/assets/icons/IonEllipsisHorizontal';
import RedirectEl from '@/renderer/pages/RedirectEl';
import QueueAll from '@/renderer/pages/QueueAll';
import QueueDownloading from '@/renderer/pages/QueueDownloading';
import QueueFinished from '@/renderer/pages/QueueFinished';
import QueueActive from '@/renderer/pages/QueueActive';
import QueueInactive from '@/renderer/pages/QueueInactive';
import QueueStopped from '@/renderer/pages/QueueStopped';
import Server from '@/renderer/pages/Server';
import Preferences from '@/renderer/pages/Preferences';
import useWindow from '@/renderer/utils/useWindow';
import useMenuForQueue from '@/renderer/utils/useMenuForQueue';
import greyInactiveSvg from '../assets/images/grey_inactive.svg';
import greyActiveLeftSvg from '../assets/images/grey_active_left.svg';
import greyActiveRightSvg from '../assets/images/grey_active_right.svg';

const YaddsMain: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { zoomWindowForDarwin } = useWindow();

  const [SIDEBAR_WIDTH] = useAtom(atomSidebarWidth);
  const [sidebarCategory] = useAtom(atomPersistenceSidebarCategory);
  const [hasSidebar, setHasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [targetDid] = useAtom(atomPersistenceTargetDid);

  const { menuItems: menuItemsInQueue } = useMenuForQueue();

  const [indicatorSrc, setIndicatorScr] = useState<string>(greyInactiveSvg);

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
          display: ['/server', '/preferences'].includes(sidebarCategory) ? 'none' : 'flex',
        }}
        onDoubleClick={() => zoomWindowForDarwin()}
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
            disabled={targetDid.length === 0}
            sx={{
              appRegion: 'no-drag',
              alignSelf: 'stretch',
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
              mr: theme.spacing(2),
            }}
          >
            <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
              {t('main.new_task')}
            </Typography>
          </Button>
          <IconButton
            color="primary"
            size="small"
            disabled={targetDid.length === 0}
            sx={{
              appRegion: 'no-drag',
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={() => window.electron.contextMenuForQueue.create(menuItemsInQueue)}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 14 }} color={targetDid.length === 0 ? 'disabled' : 'primary'} />
          </IconButton>
        </Stack>
      </AppBar>
      <Box
        sx={{
          px: theme.spacing(3),
          overflowY: ['/preferences', '/server'].includes(sidebarCategory) ? 'hidden' : 'scroll',
          height: ['/preferences', '/server'].includes(sidebarCategory)
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
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Box>
    </Paper>
  );
};

export default YaddsMain;

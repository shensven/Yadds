import { useEffect, useState } from 'react';
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
import {
  hasYaddsSidebarAtomWithPersistence,
  hasYaddsSidebarMarginTopAtom,
  sidebarWidth,
  yaddsMainSortByAtomWithPersistence,
  yaddsSidebarCategoryAtomWithPersistence,
} from '../atoms/yaddsAtoms';
import IonSearch from '../components/icons/IonSearch';
import IonEllipsisHorizontal from '../components/icons/IonEllipsisHorizontal';
import greyInactiveSvg from '../assets/yaddsSidebarIndicator/grey_inactive.svg';
import greyActiveLeftSvg from '../assets/yaddsSidebarIndicator/grey_active_left.svg';
import greyActiveRightSvg from '../assets/yaddsSidebarIndicator/grey_active_right.svg';
import RedirectEl from '../pages/RedirectEl';
import QueueAll from '../pages/QueueAll';
import QueueDownloading from '../pages/QueueDownloading';
import QueueFinished from '../pages/QueueFinished';
import QueueActive from '../pages/QueueActive';
import QueueInactive from '../pages/QueueInactive';
import QueueStopped from '../pages/QueueStopped';
import Settings from '../pages/Settings';
import appMenuItemHandler from '../utils/appMenuItemHandler';
import contextMenuItemHandler from '../utils/contextMenuItemHandler';

const YaddsMain: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [SIDEBAR_WIDTH] = useAtom(sidebarWidth);
  const [yaddsSidebarCategory] = useAtom(yaddsSidebarCategoryAtomWithPersistence);
  const [hasYaddsSidebarMarginTop] = useAtom(hasYaddsSidebarMarginTopAtom);
  const [hasYaddsSidebar, persistHasYaddsSidebar] = useAtom(hasYaddsSidebarAtomWithPersistence);
  const [yaddsMainSortBy, persistYaddsMainSortBy] = useAtom(yaddsMainSortByAtomWithPersistence);

  const [indicatorSrc, setIndicatorScr] = useState<string>(greyInactiveSvg);

  useEffect(() => {
    window.electron?.setTray(t); // Init system tary
    window.electron?.sortBy(persistYaddsMainSortBy); // Init main sort by
  }, []);

  useEffect(() => {
    window.electron?.toogleSidebar(hasYaddsSidebar, persistHasYaddsSidebar); // handle the sidebar state
    const appMenuItemLabel = appMenuItemHandler(t, hasYaddsSidebar, hasYaddsSidebarMarginTop);
    window.electron?.setApplicationMenu(appMenuItemLabel); // Init or update application menu
  }, [hasYaddsSidebar]);

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
        ...(hasYaddsSidebar && {
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
          onMouseOver={() => setIndicatorScr(hasYaddsSidebar ? greyActiveLeftSvg : greyActiveRightSvg)}
          onMouseOut={() => setIndicatorScr(greyInactiveSvg)}
          onClick={() => persistHasYaddsSidebar(!hasYaddsSidebar)}
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
          display: yaddsSidebarCategory === '/settings' ? 'none' : 'flex',
        }}
        onDoubleClick={() => window.electron.getOS() === 'darwin' && window.electron.zoomWindow()}
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
            <IonSearch sx={{ fontSize: 14, color: theme.palette.grey[500], mx: theme.spacing(1) }} />
            <InputBase
              spellCheck={false}
              size="small"
              placeholder={t('main.filter')}
              sx={{
                fontSize: 12,
                color: theme.palette.text.primary,
                '& .MuiInputBase-input': {
                  padding: 0,
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
              {t('main.network_diagnosis')}
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
              const contextMenuItemLabel = contextMenuItemHandler(t, yaddsMainSortBy);
              window.electron?.setContextMenu(contextMenuItemLabel);
            }}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 14 }} color="primary" />
          </IconButton>
        </Stack>
      </AppBar>
      <Box
        sx={{
          px: theme.spacing(3),
          overflowY: yaddsSidebarCategory === '/settings' ? 'hidden' : 'scroll',
          height: yaddsSidebarCategory === '/settings' ? '100%' : `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
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
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Paper>
  );
};

export default YaddsMain;

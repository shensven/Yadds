import { MenuItemConstructorOptions } from 'electron';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  InputBase,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { YaddsCtx } from '../context/YaddsContext';
import SIDEBAR_WIDTH from '../context/sidebarWidth';
import IonSearch from '../components/icons/IonSearch';
import IonEllipsisHorizontal from '../components/icons/IonEllipsisHorizontal';
import inactiveSvg from '../assets/YaddsSidebarSwitch/inactive.svg';
import activeLeftSvg from '../assets/YaddsSidebarSwitch/active_left.svg';
import activeRightSvg from '../assets/YaddsSidebarSwitch/active_right.svg';
import RedirectEl from '../pages/RedirectEl';
import QueueAll from '../pages/QueueAll';
import QueueDownloading from '../pages/QueueDownloading';
import QueueFinished from '../pages/QueueFinished';
import QueueActive from '../pages/QueueActive';
import QueueInactive from '../pages/QueueInactive';
import QueueStopped from '../pages/QueueStopped';
import Settings from '../pages/Settings';

const Main = styled(Paper, { shouldForwardProp: (prop) => prop !== 'hasSidebar' })<{ hasSidebar?: boolean }>(
  ({ theme, hasSidebar }) => ({
    position: 'fixed',
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    marginLeft: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(hasSidebar && {
      width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      marginLeft: `${SIDEBAR_WIDTH}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const StyledAppBar = styled(MuiAppBar)(() => ({
  appRegion: 'drag',
  position: 'sticky',
  flexDirection: 'column',
  backgroundColor: 'transparent',
}));

const StyledSearch = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.input.default,
  '&:hover': {
    backgroundColor: theme.palette.input.hover,
  },
}));

const StyledSearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'primary',
  '& .MuiInputBase-input': {
    padding: 0,
    transition: theme.transitions.create('width'),
    width: 120,
    '&:focus': {
      width: 160,
    },
  },
}));

const YaddsMain: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { yaddsSidebarCategory, hasYaddsSidebar, persistHasYaddsSidebar } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

  useEffect(() => {
    // Sync sidebar state with the main process in the renderer process
    window.electron?.toogleSidebar(hasYaddsSidebar, persistHasYaddsSidebar);
  }, [hasYaddsSidebar]);

  const template: MenuItemConstructorOptions[] = [
    { label: '全部开始' },
    { label: '全部暂停' },
    { label: '全部删除...' },
    { type: 'separator' },
    { label: '按添加时间排序', type: 'radio', checked: true },
    { label: '按下载进度排序', type: 'radio', checked: false },
    { label: '按下载速率排序', type: 'radio', checked: false },
    { label: '按文件名称排序', type: 'radio', checked: false },
    { type: 'separator' },
    { label: '显示为列表', type: 'radio', checked: true },
    { label: '显示为矩阵', type: 'radio', checked: false },
  ];

  const handleContextMenu = () => window.electron.popupContextMenu(template);

  return (
    <Main square elevation={0} hasSidebar={hasYaddsSidebar}>
      <Box sx={{ position: 'fixed', top: '47%' }}>
        <Icon
          sx={{ height: 40 }}
          onMouseOver={() => setScr(hasYaddsSidebar ? activeLeftSvg : activeRightSvg)}
          onMouseOut={() => setScr(inactiveSvg)}
          onClick={() => persistHasYaddsSidebar(!hasYaddsSidebar)}
        >
          <img src={src} alt="" draggable="false" />
        </Icon>
      </Box>
      <StyledAppBar
        elevation={0}
        sx={{ display: yaddsSidebarCategory === '/settings' ? 'none' : 'flex' }}
        onDoubleClick={() => window.electron.getOS() === 'darwin' && window.electron.zoomWindow()}
      >
        <Stack flexDirection="row" justifyContent="flex-end" alignItems="center" sx={{ p: theme.spacing(2) }}>
          <StyledSearch sx={{ appRegion: 'no-drag', mr: theme.spacing(6) }}>
            <StyledSearchIconWrapper>
              <IonSearch sx={{ fontSize: 14 }} />
            </StyledSearchIconWrapper>
            <StyledInputBase
              spellCheck={false}
              size="small"
              placeholder={t('main.search')}
              sx={{ fontSize: 12, color: theme.palette.text.primary }}
            />
          </StyledSearch>
          <Button
            size="small"
            sx={{
              appRegion: 'no-drag',
              alignSelf: 'stretch',
              backgroundColor: theme.palette.input.default,
              '&:hover': {
                backgroundColor: theme.palette.input.hover,
              },
              mr: theme.spacing(2),
            }}
          >
            <Typography
              fontWeight={500}
              sx={{
                fontSize: 12,
                lineHeight: 'normal',
                px: theme.spacing(0.5),
              }}
            >
              {t('main.new_task')}
            </Typography>
          </Button>
          <IconButton
            color="primary"
            size="small"
            sx={{
              appRegion: 'no-drag',
              backgroundColor: theme.palette.input.default,
              '&:hover': {
                backgroundColor: theme.palette.input.hover,
              },
            }}
            onClick={() => handleContextMenu()}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 14 }} color="primary" />
          </IconButton>
        </Stack>
        <Divider sx={{ opacity: 0.8 }} />
      </StyledAppBar>
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
    </Main>
  );
};

export default YaddsMain;

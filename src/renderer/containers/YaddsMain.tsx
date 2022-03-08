import { MenuItemConstructorOptions } from 'electron';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  alpha,
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
import DRAWER_WIDTH from '../context/drawerWidth';
import IonSearch from '../components/icons/IonSearch';
import IonEllipsisHorizontal from '../components/icons/IonEllipsisHorizontal';
import inactiveSvg from '../assets/YaddsDrawerSwitch/inactive.svg';
import activeLeftSvg from '../assets/YaddsDrawerSwitch/active_left.svg';
import activeRightSvg from '../assets/YaddsDrawerSwitch/active_right.svg';
import RedirectEl from '../pages/RedirectEl';
import QueueAll from '../pages/QueueAll';
import QueueDownloading from '../pages/QueueDownloading';
import QueueFinished from '../pages/QueueFinished';
import QueueActive from '../pages/QueueActive';
import QueueInactive from '../pages/QueueInactive';
import QueueStopped from '../pages/QueueStopped';
import Settings from '../pages/Settings';

const Main = styled(Paper, { shouldForwardProp: (prop) => prop !== 'hasDrawer' })<{ hasDrawer?: boolean }>(
  ({ theme, hasDrawer }) => ({
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
    ...(hasDrawer && {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: `${DRAWER_WIDTH}px`,
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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.input.default,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
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
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 160,
      },
    },
  },
}));

const YaddsMain: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { yaddsDrawerCategory, hasYaddsDrawer, persistHasYaddsDrawer } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

  useEffect(() => {
    window.electron?.toogleSidebar(hasYaddsDrawer, persistHasYaddsDrawer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasYaddsDrawer]);

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
    <Main square hasDrawer={hasYaddsDrawer}>
      <Box sx={{ position: 'fixed', top: '47%' }}>
        <Icon
          sx={{ height: 40 }}
          onMouseOver={() => setScr(hasYaddsDrawer ? activeLeftSvg : activeRightSvg)}
          onMouseOut={() => setScr(inactiveSvg)}
          onClick={() => persistHasYaddsDrawer(!hasYaddsDrawer)}
        >
          <img src={src} alt="" draggable="false" />
        </Icon>
      </Box>
      <StyledAppBar
        elevation={0}
        sx={{ display: yaddsDrawerCategory === '/settings' ? 'none' : 'flex' }}
        onDoubleClick={() => window.electron.getOS() === 'darwin' && window.electron.zoomWindow()}
      >
        <Stack flexDirection="row" justifyContent="flex-end" sx={{ p: theme.spacing(2) }}>
          <StyledSearch sx={{ mr: theme.spacing(6), appRegion: 'no-drag' }}>
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
              backgroundColor: theme.palette.input.default,
              mr: theme.spacing(2),
              appRegion: 'no-drag',
            }}
          >
            <Typography fontWeight={500} sx={{ fontSize: 12 }}>
              {t('main.new')}
            </Typography>
          </Button>
          <IconButton
            color="primary"
            size="small"
            sx={{ backgroundColor: theme.palette.input.default, appRegion: 'no-drag' }}
            onClick={() => handleContextMenu()}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 16 }} color="primary" />
          </IconButton>
        </Stack>
        <Divider sx={{ opacity: 0.8 }} />
      </StyledAppBar>
      <Box
        sx={{
          px: theme.spacing(3),
          overflowY: yaddsDrawerCategory === '/settings' ? 'hidden' : 'scroll',
          height: yaddsDrawerCategory === '/settings' ? '100%' : `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
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

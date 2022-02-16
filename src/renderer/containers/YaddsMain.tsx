import { MenuItemConstructorOptions } from 'electron';
import React, { useContext, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Icon,
  IconButton,
  InputBase,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { YaddsCtx } from '../context/YaddsContext';
import DRAWER_WIDTH from '../context/drawerWidth';
import IonSearch from '../components/icons/IonSearch';
import IonAdd from '../components/icons/IonAdd';
import IonEllipsisHorizontal from '../components/icons/IonEllipsisHorizontal';
import inactiveSvg from '../assets/YaddsDrawerSwitch/inactive.svg';
import activeLeftSvg from '../assets/YaddsDrawerSwitch/active_left.svg';
import activeRightSvg from '../assets/YaddsDrawerSwitch/active_right.svg';

const Main = styled(Paper, { shouldForwardProp: (prop) => prop !== 'hasDrawer' })<{ hasDrawer?: boolean }>(
  ({ theme, hasDrawer }) => ({
    position: 'fixed',
    overflowY: 'scroll',
    right: 0,
    width: '100%',
    height: '100%',
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

const MainHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  hasDrawer?: boolean;
}

const StyledAppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'hasDrawer' })<AppBarProps>(
  ({ theme, hasDrawer }) => ({
    padding: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

const StyledSearch = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
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

interface YaddsMainProps {
  children: React.ReactNode;
  hasAppbar: boolean;
}

const YaddsMain: React.FC<YaddsMainProps> = ({ children, hasAppbar }) => {
  const theme = useTheme();
  const { hasYaddsDrawer, setHasYaddsDrawer } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

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
    <Box>
      <Main hasDrawer={hasYaddsDrawer} square>
        <Box sx={{ position: 'fixed', top: '47%' }}>
          <Icon
            sx={{ height: 40 }}
            onMouseOver={() => setScr(hasYaddsDrawer ? activeLeftSvg : activeRightSvg)}
            onMouseOut={() => setScr(inactiveSvg)}
            onClick={() => setHasYaddsDrawer(!hasYaddsDrawer)}
          >
            <img src={src} alt="" draggable="false" />
          </Icon>
        </Box>
        <Stack sx={{ pl: theme.spacing(3), pr: theme.spacing(3), backgroundColor: theme.palette.background.default }}>
          <MainHeader sx={{ display: hasAppbar ? 'flex' : 'none' }} />
          {children}
        </Stack>
      </Main>
      <StyledAppBar
        sx={{ display: hasAppbar ? 'flex' : 'none', appRegion: 'drag' }}
        position="fixed"
        elevation={0}
        hasDrawer={hasYaddsDrawer}
      >
        <StyledSearch sx={{ mr: theme.spacing(6), appRegion: 'no-drag' }}>
          <StyledSearchIconWrapper>
            <IonSearch sx={{ fontSize: 14 }} />
          </StyledSearchIconWrapper>
          <StyledInputBase
            spellCheck={false}
            size="small"
            placeholder="搜索..."
            sx={{ fontSize: 12, color: theme.palette.grey[800] }}
          />
        </StyledSearch>
        <Button
          sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 8, mr: theme.spacing(2), appRegion: 'no-drag' }}
          size="small"
        >
          <Stack direction="row" alignItems="center">
            <IonAdd sx={{ fontSize: 16 }} color="primary" />
            <Typography sx={{ fontSize: 12 }}>新建</Typography>
          </Stack>
        </Button>
        <IconButton
          color="primary"
          size="small"
          sx={{ backgroundColor: theme.palette.grey[100], appRegion: 'no-drag' }}
          onClick={() => handleContextMenu()}
        >
          <IonEllipsisHorizontal sx={{ fontSize: 16 }} color="primary" />
        </IconButton>
      </StyledAppBar>
    </Box>
  );
};

export default YaddsMain;

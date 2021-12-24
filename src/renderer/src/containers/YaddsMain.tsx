import { MenuItemConstructorOptions } from 'electron';
import React, { useContext, useState } from 'react';
import { alpha, Box, Button, Icon, IconButton, InputBase, Stack, styled, Typography, useTheme } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { YaddsCtx } from '../context/YaddsContext';
import SearchOutlineIcon from '../components/icons/SearchOutlineIcon';
import AddOutlineIcon from '../components/icons/AddOutlineIcon';
import EllipsisHorizontalIcon from '../components/icons/EllipsisHorizontalIcon';
import drawerWidth from '../context/drawerWidth';
import inactiveSvg from '../assets/Figma/YaddsDrawerSwitch/inactive.svg';
import activeLeftSvg from '../assets/Figma/YaddsDrawerSwitch/active_left.svg';
import activeRightSvg from '../assets/Figma/YaddsDrawerSwitch/active_right.svg';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'halfWidth' })<{ halfWidth?: boolean }>(
  ({ theme, halfWidth }) => ({
    width: '100%',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(halfWidth && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const MainHeader = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  hasDrawer?: boolean;
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'hasDrawer' })<AppBarProps>(
  ({ theme, hasDrawer }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(hasDrawer && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
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
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

  const template: MenuItemConstructorOptions[] = [
    {
      label: '按照名称排序',
    },
    {
      label: '按照时间排序',
    },
  ];

  const handleContextMenu = () => {
    window.electron.contextMenu.popup(template);
  };

  return (
    <Main halfWidth={hasDrawer}>
      <Box sx={{ position: 'fixed', top: '45%' }}>
        <Icon
          sx={{ height: 40 }}
          onMouseOver={() => setScr(hasDrawer ? activeLeftSvg : activeRightSvg)}
          onMouseOut={() => setScr(inactiveSvg)}
          onClick={() => setHasDrawer(!hasDrawer)}
        >
          <img src={src} alt="" draggable="false" />
        </Icon>
      </Box>
      <Stack>
        <AppBar
          sx={{
            display: hasAppbar ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: theme.spacing(2),
          }}
          position="fixed"
          elevation={0}
          hasDrawer={hasDrawer}
        >
          <Search sx={{ marginRight: theme.spacing(6) }}>
            <SearchIconWrapper>
              <SearchOutlineIcon sx={{ fontSize: 14 }} />
            </SearchIconWrapper>
            <StyledInputBase
              spellCheck={false}
              size="small"
              placeholder="搜索..."
              sx={{ fontSize: 12, color: theme.palette.grey[800] }}
            />
          </Search>
          <Button
            sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 8, marginRight: theme.spacing(2) }}
            size="small"
          >
            <Stack direction="row" alignItems="center">
              <AddOutlineIcon fontSize="small" color="primary" />
              <Typography sx={{ fontSize: 12 }}>新建</Typography>
            </Stack>
          </Button>
          <IconButton
            color="primary"
            size="small"
            sx={{ backgroundColor: theme.palette.grey[100] }}
            onClick={() => handleContextMenu()}
          >
            <EllipsisHorizontalIcon fontSize="small" color="primary" />
          </IconButton>
        </AppBar>
        <Stack sx={{ paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3) }}>
          <MainHeader sx={{ display: hasAppbar ? 'flex' : 'none' }} />
          {children}
        </Stack>
      </Stack>
    </Main>
  );
};

export default YaddsMain;

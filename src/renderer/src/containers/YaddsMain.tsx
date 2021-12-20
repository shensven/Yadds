import React, { useContext, useState } from 'react';
import { Box, Button, ButtonGroup, Icon, IconButton, styled, Typography, useTheme } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { YaddsCtx } from '../context/YaddsContext';
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

interface YaddsMainProps {
  children: React.ReactNode;
  hasAppbar: boolean;
}

const YaddsMain: React.FC<YaddsMainProps> = ({ children, hasAppbar }) => {
  const theme = useTheme();
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

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
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
          <Button sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 8 }} size="small">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AddIcon fontSize="small" />
              <Typography sx={{ fontSize: 12 }}>新建</Typography>
            </Box>
          </Button>
          <ButtonGroup sx={{ marginLeft: theme.spacing(2) }}>
            <IconButton color="primary" size="small" sx={{ backgroundColor: theme.palette.grey[100] }}>
              <MoreHorizIcon fontSize="small" color="primary" />
            </IconButton>
          </ButtonGroup>
        </AppBar>
        <Box sx={{ paddingLeft: theme.spacing(3), paddingRight: theme.spacing(3) }}>
          <MainHeader sx={{ display: hasAppbar ? 'flex' : 'none' }} />
          {children}
        </Box>
      </Box>
    </Main>
  );
};

export default YaddsMain;

import { styled } from '@mui/material';

const drawerWidth = 240;

const YaddsMain = styled('main', { shouldForwardProp: (prop) => prop !== 'halfWidth' })<{ halfWidth?: boolean }>(
  ({ theme, halfWidth }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(halfWidth && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

export default YaddsMain;

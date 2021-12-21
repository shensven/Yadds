import { useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import drawerWidth from '../context/drawerWidth';
import ShapesOutlineIcon from '../components/icons/ShapesOutlineIcon';
import ArrowDownCircleOutlineIcon from '../components/icons/ArrowDownCircleOutlineIcon';
import CheckmarkCircleOutlineIcon from '../components/icons/CheckmarkCircleOutlineIcon';
import CloudUploadOutlineIcon from '../components/icons/CloudUploadOutlineIcon';
import CloudOfflineOutlineIcon from '../components/icons/CloudOfflineOutlineIcon';
import StopCircleOutlineIcon from '../components/icons/StopCircleOutlineIcon';
import CogOutlineIcon from '../components/icons/CogOutlineIcon';

interface Category {
  path: string;
  name: string;
  icon: JSX.Element;
}

const YaddsDrawer: React.FC = () => {
  const history = useHistory();
  const theme = useTheme();

  const { hasDrawer, select, setSelect } = useContext(YaddsCtx);

  const category: Category[] = [
    { path: '/queueAll', name: '全部下载项目', icon: <ShapesOutlineIcon /> },
    { path: '/queueDownloading', name: '下载中', icon: <ArrowDownCircleOutlineIcon /> },
    { path: '/queueFinished', name: '已完成', icon: <CheckmarkCircleOutlineIcon /> },
    { path: '/queueActive', name: '进行中', icon: <CloudUploadOutlineIcon /> },
    { path: '/queueInactive', name: '非进行中', icon: <CloudOfflineOutlineIcon /> },
    { path: '/queueStopped', name: '停用', icon: <StopCircleOutlineIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
      open={hasDrawer}
    >
      <List>
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
              dense
              selected={select === item.path}
              onClick={() => {
                setSelect(item.path);
                history.push(item.path);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    style={{
                      fontWeight: select === item.path ? 'bold' : 'normal',
                      color: select === item.path ? theme.palette.primary.main : theme.palette.grey[800],
                    }}
                  >
                    {item.name}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem>
          <ListItemButton
            selected={select === 'settings'}
            onClick={() => {
              setSelect('settings');
              history.push('/settings');
            }}
          >
            <ListItemIcon>
              <CogOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: select === 'settings' ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                >
                  设置
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default withRouter(YaddsDrawer);

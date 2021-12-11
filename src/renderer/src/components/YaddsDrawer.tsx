import { useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FileDownloadDoneRoundedIcon from '@mui/icons-material/FileDownloadDoneRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import SyncDisabledRoundedIcon from '@mui/icons-material/SyncDisabledRounded';
import FileDownloadOffRoundedIcon from '@mui/icons-material/FileDownloadOffRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { YaddsCtx } from '../context/YaddsContext';
import yaddsTheme from '../theme/yaddsTheme';

interface Category {
  path: string;
  name: string;
  icon: JSX.Element;
}

const drawerWidth = 240;

const YaddsDrawer: React.FC = () => {
  const { hasDrawer, select, setSelect } = useContext(YaddsCtx);

  const history = useHistory();

  const category: Category[] = [
    {
      path: '/queueAll',
      name: '全部下载项目',
      icon: <CategoryRoundedIcon />,
    },
    {
      path: '/queueDownloading',
      name: '下载中',
      icon: <FileDownloadRoundedIcon />,
    },
    {
      path: '/queueFinished',
      name: '已完成',
      icon: <FileDownloadDoneRoundedIcon />,
    },
    {
      path: '/queueActive',
      name: '进行中',
      icon: <SyncRoundedIcon />,
    },
    {
      path: '/queueInactive',
      name: '非进行中',
      icon: <SyncDisabledRoundedIcon />,
    },
    {
      path: '/queueStopped',
      name: '停用',
      icon: <FileDownloadOffRoundedIcon />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={hasDrawer}
    >
      <List>
        {category.map((item: Category) => (
          <ListItem key={item.path}>
            <ListItemButton
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
                      color: select === item.path ? yaddsTheme.palette.primary.main : yaddsTheme.palette.text.primary,
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
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: select === 'settings' ? yaddsTheme.palette.primary.main : yaddsTheme.palette.text.primary,
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

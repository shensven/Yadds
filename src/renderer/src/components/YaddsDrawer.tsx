import { useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Drawer, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import yaddsTheme from '../theme/yaddsTheme';
import shapesOutlineSvg from '../assets/ionicons/shapes-outline.svg';
import arrowDownCircleOutlineSvg from '../assets/ionicons/arrow-down-circle-outline.svg';
import checkmarkCircleOutlineSvg from '../assets/ionicons/checkmark-circle-outline.svg';
import cloudUploadOutlineSvg from '../assets/ionicons/cloud-upload-outline.svg';
import cloudOfflineOutlineSvg from '../assets/ionicons/cloud-offline-outline.svg';
import stopCircleOutlineSvg from '../assets/ionicons/stop-circle-outline.svg';
import cogOutlineSvg from '../assets/ionicons/cog-outline.svg';

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
      icon: (
        <Icon>
          <img src={shapesOutlineSvg} width={23} />
        </Icon>
      ),
    },
    {
      path: '/queueDownloading',
      name: '下载中',
      icon: (
        <Icon>
          <img src={arrowDownCircleOutlineSvg} width={24} />
        </Icon>
      ),
    },
    {
      path: '/queueFinished',
      name: '已完成',
      icon: (
        <Icon>
          <img src={checkmarkCircleOutlineSvg} width={24} />
        </Icon>
      ),
    },
    {
      path: '/queueActive',
      name: '进行中',
      icon: (
        <Icon>
          <img src={cloudUploadOutlineSvg} width={22} />
        </Icon>
      ),
    },
    {
      path: '/queueInactive',
      name: '非进行中',
      icon: (
        <Icon>
          <img src={cloudOfflineOutlineSvg} width={21} />
        </Icon>
      ),
    },
    {
      path: '/queueStopped',
      name: '停用',
      icon: (
        <Icon>
          <img src={stopCircleOutlineSvg} width={24} />
        </Icon>
      ),
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
              <Icon>
                <img src={cogOutlineSvg} width={24} />
              </Icon>
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

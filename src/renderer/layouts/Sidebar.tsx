import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { List, ListItem, Divider, useTheme } from '@mui/material';
import { atomOS } from '@/renderer/atoms/atomConstant';
import { atomHasSidebarMarginTop } from '@/renderer/atoms/atomUI';
import IonServerOutline from '@/renderer/assets/icons/IonServerOutline';
import IonServer from '@/renderer/assets/icons/IonServer';
import IonCogOutline from '@/renderer/assets/icons/IonCogOutline';
import IonCog from '@/renderer/assets/icons/IonCog';
import StyledDrawer from './StyledDrawer';
import useCategory from './useCategory';
import StyledListItemButton from './StyledListItemButton';

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [OS_PLATFORM] = useAtom(atomOS);

  const [hasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);

  const categorys = useCategory();

  return (
    <StyledDrawer>
      <List
        dense
        sx={{
          mt: theme.spacing(1),
          ...(hasSidebarMarginTop && {
            [(OS_PLATFORM === 'darwin' && 'mt') as string]: theme.spacing(4),
          }),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        {categorys.map((item) => (
          <ListItem key={item.path}>
            <StyledListItemButton category={item} />
          </ListItem>
        ))}
        <Divider light sx={{ mx: theme.spacing(2), my: theme.spacing(1) }} />
        <ListItem>
          <StyledListItemButton
            category={{
              path: '/server',
              tasksLength: 0,
              name: t('sidebar.server'),
              activeIcon: <IonServer sx={{ fontSize: 20 }} />,
              inactiveIcon: <IonServerOutline sx={{ fontSize: 20 }} />,
            }}
          />
        </ListItem>
      </List>
      <List>
        <ListItem>
          <StyledListItemButton
            category={{
              path: '/preferences',
              tasksLength: 0,
              name: t('sidebar.preferences'),
              activeIcon: <IonCog sx={{ fontSize: 20 }} />,
              inactiveIcon: <IonCogOutline sx={{ fontSize: 20 }} />,
            }}
          />
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;

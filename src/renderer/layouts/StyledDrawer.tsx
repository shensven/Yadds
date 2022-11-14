import { PropsWithChildren } from 'react';
import { Drawer } from '@mui/material';
import { useAtom } from 'jotai';
import { atomSidebarWidth } from '../atoms/atomConstant';
import { atomPersistenceHasSidebar } from '../atoms/atomUI';

function StyledDrawer(props: PropsWithChildren) {
  const { children } = props;

  const [SIDEBAR_WIDTH] = useAtom(atomSidebarWidth);
  const [hasSidebar] = useAtom(atomPersistenceHasSidebar);

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={hasSidebar}
      sx={{ '& .MuiDrawer-paper': { backgroundColor: 'transparent', width: SIDEBAR_WIDTH } }}
    >
      {children}
    </Drawer>
  );
}

export default StyledDrawer;

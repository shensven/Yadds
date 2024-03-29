import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { atomPersistenceSidebarCategory, SidebarCategory } from '@/renderer/atoms/atomUI';

const useNav = () => {
  const n = useNavigate();
  const [, setSidebarCategory] = useAtom(atomPersistenceSidebarCategory);

  const navigate = (sidebarCategory: SidebarCategory) => {
    n(sidebarCategory);
    setSidebarCategory(sidebarCategory);
  };

  return { navigate };
};

export default useNav;

export type Nav = ReturnType<typeof useNav>['navigate'];

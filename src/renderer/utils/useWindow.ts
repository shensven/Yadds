import { useAtom } from 'jotai';
import { atomOS } from '../atoms/atomConstant';

const useWindow = () => {
  const [OS_PLATFORM] = useAtom(atomOS);

  const zoomWindowForDarwin = () => {
    if (OS_PLATFORM === 'darwin') {
      window.electron.app.zoomWindow();
    }
  };

  return { zoomWindowForDarwin };
};

export default useWindow;

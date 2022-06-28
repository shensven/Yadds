import React from 'react';
import QueueAll from './QueueAll';
import QueueDownloading from './QueueDownloading';
import QueueFinished from './QueueFinished';
import QueueActive from './QueueActive';
import QueueInactive from './QueueInactive';
import QueueStopped from './QueueStopped';
import Server from './Server';
import Preferences from './Preferences';
import { SidebarCategory } from '../atoms/atomUI';

const RedirectEl: React.FC = () => {
  const category = window.electron?.cache.get('sidebarCategory') as SidebarCategory | undefined;

  switch (category) {
    case '/queueAll':
      return <QueueAll />;
    case '/queueDownloading':
      return <QueueDownloading />;
    case '/queueFinished':
      return <QueueFinished />;
    case '/queueActive':
      return <QueueActive />;
    case '/queueInactive':
      return <QueueInactive />;
    case '/queueStopped':
      return <QueueStopped />;
    case '/server':
      return <Server />;
    case '/preferences':
      return <Preferences />;
    default:
      return <QueueAll />;
  }
};

export default RedirectEl;

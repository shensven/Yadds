import QueueActive from './QueueActive';
import QueueAll from './QueueAll';
import QueueDownloading from './QueueDownloading';
import QueueFinished from './QueueFinished';
import QueueInactive from './QueueInactive';
import QueueStopped from './QueueStopped';
import Settings from './Settings';

const RedirectEl: React.FC = () => {
  const category = window.electron?.store.get('yaddsSidebarCategory') as string;

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
    case '/settings':
      return <Settings />;
    default:
      return <QueueAll />;
  }
};

export default RedirectEl;

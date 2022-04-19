import List from '@mui/material/List';
import { useAtom } from 'jotai';
import orderBy from 'lodash/orderBy';
import {
  DSTasks,
  tasksAtom,
  yaddsMainOrderIsAscendAtomWithPersistence,
  yaddsMainOrderIteraterAtomWithPersistence,
} from '../atoms/yaddsAtoms';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';

const QueueActive: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);
  const [orderIterater] = useAtom(yaddsMainOrderIteraterAtomWithPersistence);
  const [orderIsAscend] = useAtom(yaddsMainOrderIsAscendAtomWithPersistence);

  const getIteratees = (item: DSTasks) => {
    switch (orderIterater) {
      case 'date':
        return [item.additional?.detail.create_time];
      case 'title':
        return [item.title.toLowerCase()];
      case 'download_progress':
        return [(item.additional?.transfer.size_downloaded as number) / item.size];
      case 'download_speed':
        return [item.additional?.transfer.speed_download];
      default:
        return [item.additional?.detail.create_time];
    }
  };

  if (tasks.filter((task) => task.status === 2 || task.status === 8).length === 0) {
    return <QueueEmpty />;
  }

  return (
    <List>
      {orderBy(
        tasks.filter((task) => task.status === 2 || task.status === 8),
        (item) => getIteratees(item),
        orderIsAscend ? 'asc' : 'desc'
      ).map((item) => (
        <MainListItem key={item.id} item={item} />
      ))}
    </List>
  );
};

export default QueueActive;

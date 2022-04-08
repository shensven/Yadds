import { List } from '@mui/material';
import { useAtom } from 'jotai';
import { tasksAtom } from '../atoms/yaddsAtoms';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';

const QueueAll: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);

  return tasks.length === 0 ? (
    <QueueEmpty />
  ) : (
    <List>
      {tasks.map((item) => (
        <MainListItem key={item.id} item={item} />
      ))}
    </List>
  );
};

export default QueueAll;

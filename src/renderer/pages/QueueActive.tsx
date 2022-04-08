import { List } from '@mui/material';
import { useAtom } from 'jotai';
import { tasksAtom } from '../atoms/yaddsAtoms';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';

const QueueActive: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);

  return tasks.filter((task) => task.status === 2 || task.status === 8).length === 0 ? (
    <QueueEmpty />
  ) : (
    <List>
      {tasks
        .filter((task) => task.status === 2 || task.status === 8)
        .map((item) => (
          <MainListItem key={item.id} item={item} />
        ))}
    </List>
  );
};

export default QueueActive;

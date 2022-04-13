import List from '@mui/material/List';
import { useAtom } from 'jotai';
import { tasksAtom } from '../atoms/yaddsAtoms';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';

const QueueFinished: React.FC = () => {
  const [tasks] = useAtom(tasksAtom);

  return tasks.filter((task) => task.status === 'finished' || task.status === 5).length === 0 ? (
    <QueueEmpty />
  ) : (
    <List>
      {tasks
        .filter((task) => task.status === 'finished' || task.status === 5)
        .map((item) => (
          <MainListItem key={item.id} item={item} />
        ))}
    </List>
  );
};

export default QueueFinished;

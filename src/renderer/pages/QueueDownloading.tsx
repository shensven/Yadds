import { useContext } from 'react';
import { List } from '@mui/material';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';
import { DSTasks, YaddsCtx } from '../context/YaddsContext';

const QueueDownloading: React.FC = () => {
  const { tasks } = useContext(YaddsCtx);

  return tasks.filter((task) => task.status === 2).length === 0 ? (
    <QueueEmpty />
  ) : (
    <List>
      {tasks
        .filter((task) => task.status === 2)
        .map((item: DSTasks, index: number) => (
          <MainListItem key={item.id} item={item} index={index} />
        ))}
    </List>
  );
};

export default QueueDownloading;

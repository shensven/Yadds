import { useContext } from 'react';
import { List } from '@mui/material';
import QueueEmpty from '../components/QueueEmpty/QueueEmpty';
import MainListItem from '../components/listItem/MainListItem';
import { DSTasks, YaddsCtx } from '../context/YaddsContext';

const QueueAll: React.FC = () => {
  const { tasks } = useContext(YaddsCtx);

  return tasks.length === 0 ? (
    <QueueEmpty />
  ) : (
    <List>
      {tasks.map((item: DSTasks) => (
        <MainListItem key={item.id} item={item} />
      ))}
    </List>
  );
};

export default QueueAll;

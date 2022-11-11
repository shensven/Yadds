import React from 'react';
import { useAtom } from 'jotai';
import { orderBy } from 'lodash';
import { List } from '@mui/material';
import { atomPersistenceQueueIsAscend, atomPersistenceQueueIterater } from '@/renderer/atoms/atomUI';
import { Task, atomTasks } from '@/renderer/atoms/atomTask';
import QueueEmpty from './Queue/QueueEmpty';
import QueueItem from './Queue/QueueItem';

const QueueInactive: React.FC = () => {
  const [tasks] = useAtom(atomTasks);
  const [queueIterater] = useAtom(atomPersistenceQueueIterater);
  const [queueIsAscend] = useAtom(atomPersistenceQueueIsAscend);

  const getIteratees = (item: Task) => {
    switch (queueIterater) {
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

  if (tasks.filter((task) => task.status === 3).length === 0) {
    return <QueueEmpty />;
  }

  return (
    <List>
      {orderBy(
        tasks.filter((task) => task.status === 3),
        (item) => getIteratees(item),
        queueIsAscend ? 'asc' : 'desc'
      ).map((item) => (
        <QueueItem key={item.id} item={item} />
      ))}
    </List>
  );
};
export default QueueInactive;

import React from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import bagDynamicClay from './assets/bag-dynamic-clay.png';

const QueueEmpty: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <img src={bagDynamicClay} alt="" draggable="false" width={144} style={{ marginBottom: theme.spacing(9) }} />
    </Stack>
  );
};

export default QueueEmpty;

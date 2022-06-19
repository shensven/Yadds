import React from 'react';
import { Stack, useTheme } from '@mui/material';
import bagDynamicClay from '../../assets/images/bag-dynamic-clay.png';

const QueueEmpty: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <img src={bagDynamicClay} alt="" draggable="false" width={144} style={{ marginBottom: theme.spacing(9) }} />
    </Stack>
  );
};

export default QueueEmpty;

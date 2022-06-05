import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'react-i18next';
import byteSize from 'byte-size';
import IonPlay from '../../components/icons/IonPlay';
import IonPause from '../../components/icons/IonPause';
import TablerArrowNarrowUp from '../../components/icons/TablerArrowNarrowUp';
import TablerArrowNarrowDown from '../../components/icons/TablerArrowNarrowDown';
import { Task } from '../../atoms/atomTask';

const QueueItem: React.FC<{ item: Task }> = (props: { item: Task }) => {
  const { t } = useTranslation();

  const { item } = props;

  const SIZE = byteSize(item.size, { units: 'iec', precision: 2 });
  const SIZE_DOWNLOADED = byteSize(item.additional?.transfer.size_downloaded as number, { units: 'iec', precision: 2 });
  const SPEED_DOWNLOAD = byteSize(item.additional?.transfer.speed_download as number, { units: 'iec', precision: 2 });
  const SPEED_UPLOAD = byteSize(item.additional?.transfer.speed_upload as number, { units: 'iec', precision: 2 });

  const theme = useTheme();

  const [hasAction, setHasAction] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(true);

  return (
    <ListItem>
      <ListItemButton
        disableRipple
        sx={{
          width: '100%',
          backgroundColor: theme.palette.card.default,
          '&:hover': { backgroundColor: theme.palette.card.hover },
        }}
        onMouseOver={() => setHasAction(true)}
        onMouseOut={() => setHasAction(false)}
      >
        <ListItemText>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: 'relative' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.primary,
                pr: 0,
                transition: theme.transitions.create('padding', {
                  easing: 'cubic-bezier(.4,0,.6,1)',
                  duration: theme.transitions.duration.shortest,
                }),
                ...(hasAction && {
                  pr: theme.spacing(3),
                }),
              }}
            >
              {item.title}
            </Typography>
            <ButtonBase
              disableRipple
              sx={{
                ml: theme.spacing(1),
                position: 'absolute',
                right: 0,
                opacity: 0,
                transform: 'scale(0)',
                transition: theme.transitions.create(['opacity', 'transform'], {
                  easing: 'cubic-bezier(.4,0,.6,1)',
                  duration: theme.transitions.duration.short,
                }),
                ...(hasAction && {
                  opacity: 1,
                  transform: 'scale(1)',
                  transition: theme.transitions.create(['opacity', 'transform'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.shortest,
                  }),
                }),
              }}
              onClick={() => setIsDownload(!isDownload)}
            >
              {isDownload ? (
                <IonPause sx={{ fontSize: 16 }} color="primary" />
              ) : (
                <IonPlay sx={{ fontSize: 16 }} color="primary" />
              )}
            </ButtonBase>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" sx={{ width: 240 }}>
                {(item.additional?.transfer.size_downloaded as number) !== item.size && (
                  <LinearProgress
                    variant="determinate"
                    value={((item.additional?.transfer.size_downloaded as number) / item.size) * 100}
                    sx={{ width: 80, borderRadius: theme.shape.borderRadius, mr: 1 }}
                  />
                )}
                <Typography
                  sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: theme.palette.text.disabled }}
                >
                  {(item.additional?.transfer.size_downloaded as number) !== item.size &&
                    `${SIZE_DOWNLOADED.value} ${SIZE_DOWNLOADED.unit} / `}
                  {SIZE.value} {SIZE.unit}
                </Typography>
              </Stack>
              {(item.additional?.transfer.size_downloaded as number) !== item.size && (
                <Stack direction="row" alignItems="center" width={100}>
                  <TablerArrowNarrowDown sx={{ fontSize: 14 }} color="info" />
                  <Typography
                    sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: theme.palette.text.disabled }}
                  >
                    {SPEED_DOWNLOAD.value} {SPEED_DOWNLOAD.unit}/s
                  </Typography>
                </Stack>
              )}
              {(item.status === 2 || item.status === 8) && (
                <Stack direction="row" alignItems="center" width={100}>
                  <TablerArrowNarrowUp sx={{ fontSize: 14 }} color="info" />
                  <Typography
                    sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: theme.palette.text.disabled }}
                  >
                    {SPEED_UPLOAD.value} {SPEED_UPLOAD.unit}/s
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: theme.palette.text.disabled }}>
              {(item.additional?.transfer.size_downloaded as number) === item.size
                ? t('main.completed')
                : // : `00:00:${item.additional?.seconds_left.toString()}`}
                  `00:00:00`}
            </Typography>
          </Stack>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default QueueItem;

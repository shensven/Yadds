import React from 'react';
import { useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material';
import BaseInfomationCard from './Server/BaseInfomationCard';
import CardUnit from './Server/CardUnit';
import FluentVirtualNetwork20Filled from '../assets/icons/FluentVirtualNetwork20Filled';
import EosIconsThreeDotsLoading from '../assets/icons/EosIconsThreeDotsLoading';
import IcRoundCalendarViewWeek from '../assets/icons/IcRoundCalendarViewWeek';
import IcOutlineInfo from '../assets/icons/IcOutlineInfo';
import IcOutlineAlbum from '../assets/icons/IcOutlineAlbum';
import IcOutlineExplore from '../assets/icons/IcOutlineExplore';
import IcOutlineCable from '../assets/icons/IcOutlineCable';
import IcRoundSwapHoriz from '../assets/icons/IcRoundSwapHoriz';
import {
  atomNasInfo,
  atomPersistenceServerActiveTab,
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
} from '../atoms/atomUI';
import { atomFetchStatus } from '../atoms/atomTask';
import useWindow from '../utils/useWindow';
import useByteSizeForQuota from '../utils/useByteSizeForQuota';

const Server: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [fetchStatus] = useAtom(atomFetchStatus);

  const [serverActiveTab, setServerActiveTab] = useAtom(atomPersistenceServerActiveTab);
  const [nasInfo] = useAtom(atomNasInfo);
  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [targeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const { zoomWindowForDarwin } = useWindow();

  const { updateByteSize: updateByteSizeForQuota } = useByteSizeForQuota();

  const basicInfomation = [
    {
      title: t('server.synology_nas'),
      value: nasInfo.model,
      unit: '',
      icon: <IcRoundCalendarViewWeek sx={{ fontSize: 20 }} />,
      type: 'text',
    },
    {
      title: t('server.dsm_version'),
      value: nasInfo.version,
      unit: '',
      icon: <IcOutlineInfo sx={{ fontSize: 20 }} />,
      type: 'text',
    },
    {
      title: t('server.quota'),
      value: targeByteSizeForQuota.max.value,
      unit: targeByteSizeForQuota.max.unit,
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
      type: 'select',
    },
    {
      title: t('server.available_capacity'),
      value: targeByteSizeForQuota.available.value,
      unit: targeByteSizeForQuota.available.unit,
      icon: <IcOutlineAlbum sx={{ fontSize: 20 }} />,
      type: 'text',
    },
  ];
  const route = [
    {
      title: t('server.quickconnect_coordinator'),
      value: 'global.quickconnect.to',
      icon: <IcOutlineExplore sx={{ fontSize: 20 }} />,
    },
    {
      title: t('server.host_address'),
      value: 'your-nas.cn3.quickconnect.cn',
      icon: <IcOutlineCable sx={{ fontSize: 20 }} />,
    },
  ];
  const responsiveness = [
    {
      title: 'DS920+',
      value: '32',
      unit: 'ms',
      icon: <IcRoundSwapHoriz sx={{ fontSize: 20 }} />,
    },
  ];

  useUpdateEffect(() => {
    updateByteSizeForQuota();
  }, [quotaList]);

  useUpdateEffect(() => {
    updateByteSizeForQuota();
  }, [targeMenuItemForQuota]);

  return (
    <Box>
      <Box sx={{ height: theme.spacing(5), appRegion: 'drag' }} onDoubleClick={() => zoomWindowForDarwin()} />
      <Stack sx={{ pl: theme.spacing(2) }}>
        <Stack flexDirection="row" alignItems="center" sx={{ mb: theme.spacing(2) }}>
          <Typography variant="h4" fontWeight={600} color={theme.palette.text.primary}>
            {t('server.server')}
          </Typography>
          {fetchStatus === 'stopped' && (
            <Tooltip title="没有连接 DSM 实例" placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <FluentVirtualNetwork20Filled color="disabled" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
          {['pending'].includes(fetchStatus) && (
            <Tooltip title="等待网络" placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <EosIconsThreeDotsLoading color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
          {fetchStatus === 'polling' && (
            <Tooltip title="已和 DSM 建立连接" placement="right" arrow>
              <Stack alignItems="center" sx={{ ml: theme.spacing(1) }}>
                <FluentVirtualNetwork20Filled color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </Tooltip>
          )}
        </Stack>
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <ToggleButtonGroup size="small" sx={{ height: theme.spacing(3) }}>
            <ToggleButton
              value="left"
              disableRipple
              selected={serverActiveTab === 'basicInfomation'}
              sx={{ px: theme.spacing(2) }}
              onClick={() => setServerActiveTab('basicInfomation')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.basic_information')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="left"
              disableRipple
              selected={serverActiveTab === 'route'}
              sx={{ px: theme.spacing(2) }}
              onClick={() => setServerActiveTab('route')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.route')}
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="right"
              disableRipple
              selected={serverActiveTab === 'responsiveness'}
              sx={{ px: theme.spacing(2) }}
              onClick={() => setServerActiveTab('responsiveness')}
            >
              <Typography variant="button" fontSize={12} fontWeight={600}>
                {t('server.responsiveness')}
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack flexDirection="row">
            {serverActiveTab === 'route' && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                  {t('server.network_diagnosis')}
                </Typography>
              </Button>
            )}
            {serverActiveTab === 'responsiveness' && (
              <Button
                size="small"
                sx={{
                  backgroundColor: theme.palette.input.default,
                  '&:hover': { backgroundColor: theme.palette.input.hover },
                  ml: theme.spacing(1),
                }}
              >
                <Typography fontSize={12} fontWeight={500} sx={{ px: theme.spacing(0.5) }}>
                  {t('server.ping')}
                </Typography>
              </Button>
            )}
          </Stack>
        </Stack>
        {serverActiveTab === 'basicInfomation' && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {basicInfomation.map((item, index) => (
              <BaseInfomationCard
                type={item.type as 'text' | 'select'}
                hasMarginRight={basicInfomation.length - 1 !== index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'route' && (
          <Stack flexDirection="column" mt={theme.spacing(4)} width="100%">
            {route.map((item) => (
              <CardUnit
                hasIconButton={false}
                hasMarginRight={false}
                title={item.title}
                value={item.value}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
        {serverActiveTab === 'responsiveness' && (
          <Stack flexDirection="row" mt={theme.spacing(4)} width="100%">
            {responsiveness.map((item, index) => (
              <CardUnit
                hasIconButton={false}
                hasMarginRight={responsiveness.length - 1 === index}
                title={item.title}
                value={item.value}
                unit={item.unit}
                icon={item.icon}
                key={item.title}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Server;

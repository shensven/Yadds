import { useState } from 'react';
import { useAtom } from 'jotai';
import { Icon, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList } from '@/renderer/atoms/atomUI';

interface IBaseInfomationCard {
  type: 'text' | 'select';
  hasMarginRight: boolean;
  icon: JSX.Element;
  title: string;
  value: string;
  unit: string;
}

const BaseInfomationCard: React.FC<IBaseInfomationCard> = (props: IBaseInfomationCard) => {
  const { type, hasMarginRight, icon, title, value, unit } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota, setTargeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);

  const [hasSelecterForQuota, setHasSelecterForQuota] = useState(false);

  return (
    <Stack
      sx={{
        borderRadius: 1,
        backgroundColor: theme.palette.card.default,
        mr: !hasMarginRight ? 0 : theme.spacing(2),
        p: theme.spacing(1),
        minWidth: 159.5,
        height: theme.spacing(9),
        justifyContent: 'space-between',
      }}
    >
      <Stack flexDirection="row" alignItems="center">
        <Icon color="primary">{icon}</Icon>
        <Typography noWrap variant="subtitle2" color={theme.palette.primary.main}>
          {title}
        </Typography>
      </Stack>
      {type === 'text' && (
        <Stack flexDirection="row" alignItems="baseline" pr={theme.spacing(1)}>
          <Typography
            color={value === '-' ? theme.palette.text.disabled : theme.palette.text.primary}
            noWrap
            fontSize={20}
            fontWeight={700}
            pl={theme.spacing(0.5)}
          >
            {value}
          </Typography>
          {unit.length > 0 && (
            <Typography
              color={value === '-' ? theme.palette.text.disabled : theme.palette.text.secondary}
              fontSize={12}
              fontWeight={500}
              pl={theme.spacing(0.5)}
            >
              {unit}
            </Typography>
          )}
        </Stack>
      )}
      {type === 'select' && (
        <Select
          size="small"
          displayEmpty
          value={quotaList.length > 0 ? targeMenuItemForQuota : ''}
          renderValue={() => (
            <Stack flexDirection="row" alignItems="baseline">
              <Typography
                color={value === '-' ? theme.palette.text.disabled : theme.palette.text.primary}
                noWrap
                fontSize={20}
                fontWeight={700}
              >
                {value}
              </Typography>
              <Typography
                color={value === '-' ? theme.palette.text.disabled : theme.palette.text.secondary}
                fontSize={12}
                fontWeight={500}
                pl={theme.spacing(0.5)}
              >
                {unit}
              </Typography>
            </Stack>
          )}
          disabled={quotaList.length === 0}
          sx={{
            width: '100%',
            fontSize: 14,
            borderRadius: 0.6,
            '& .MuiOutlinedInput-input': {
              py: 0,
              px: theme.spacing(1),
            },
          }}
          open={hasSelecterForQuota}
          onOpen={() => setHasSelecterForQuota(true)}
          onClose={() => setHasSelecterForQuota(false)}
        >
          {quotaList.map((volume) => [
            <MenuItem key={volume.name} disabled dense disableRipple>
              <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {`${t('server.volume')} ${volume.name}`}
              </Typography>
            </MenuItem>,
            volume.children.map((share) => (
              <MenuItem
                key={share.name}
                dense
                disableRipple
                value={targeMenuItemForQuota.length === 0 ? undefined : `volume:${volume.name},${share.name}`}
              >
                <Typography
                  sx={{
                    ml: theme.spacing(2),
                    fontSize: 14,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => {
                    setTargeMenuItemForQuota(`volume:${volume.name},${share.name}`);
                    setHasSelecterForQuota(false);
                  }}
                >
                  {share.name.split(':')[1]}
                </Typography>
              </MenuItem>
            )),
          ])}
        </Select>
      )}
    </Stack>
  );
};

export default BaseInfomationCard;

import { useAtom } from 'jotai';
import { Card, Icon, IconButton, Stack, Typography, useTheme } from '@mui/material';
import IonEllipsisHorizontal from '@/renderer/assets/icons/IonEllipsisHorizontal';
import { atomPersistenceTargetDid } from '@/renderer/atoms/atomConnectedUsers';

interface ICardUnit {
  hasIconButton: boolean;
  hasMarginRight: boolean;
  icon: JSX.Element;
  title: string;
  value: string;
  unit?: string;
  onClick?: () => void;
}

const CardUnit: React.FC<ICardUnit> = (props: ICardUnit) => {
  const { hasIconButton, hasMarginRight, icon, title, value, unit, onClick } = props;

  const theme = useTheme();
  const [targetDid] = useAtom(atomPersistenceTargetDid);

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.card.default,
        mr: !hasMarginRight ? 0 : theme.spacing(2),
        mb: theme.spacing(2),
        p: theme.spacing(1),
        minWidth: 159.5,
        height: theme.spacing(9),
      }}
    >
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack flexDirection="row" alignItems="center">
          <Icon color="primary">{icon}</Icon>
          <Typography noWrap variant="subtitle2" color={theme.palette.primary.main}>
            {title}
          </Typography>
        </Stack>
        {hasIconButton && (
          <IconButton
            color="primary"
            size="small"
            disabled={targetDid.length === 0}
            sx={{
              appRegion: 'no-drag',
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={onClick}
          >
            <IonEllipsisHorizontal sx={{ fontSize: 14 }} color={targetDid.length === 0 ? 'disabled' : 'primary'} />
          </IconButton>
        )}
      </Stack>
      <Stack flexDirection="row" alignItems="baseline" pr={theme.spacing(1)}>
        <Typography noWrap fontSize={20} fontWeight={700} pl={theme.spacing(0.5)}>
          {value}
        </Typography>
        <Typography fontSize={12} fontWeight={500} pl={theme.spacing(0.5)}>
          {unit}
        </Typography>
      </Stack>
    </Card>
  );
};

CardUnit.defaultProps = {
  unit: '',
  onClick: () => {},
};

export default CardUnit;

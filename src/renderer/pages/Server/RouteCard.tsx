import { Card, Icon, Stack, Typography, useTheme } from '@mui/material';

interface IRouteCard {
  icon: JSX.Element;
  title: string;
  value: string;
}

const RouteCard: React.FC<IRouteCard> = (props: IRouteCard) => {
  const { icon, title, value } = props;

  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.card.default,
        mb: theme.spacing(2),
        p: theme.spacing(1),
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
      </Stack>
      <Stack flexDirection="row" alignItems="baseline" pr={theme.spacing(1)}>
        <Typography noWrap fontSize={20} fontWeight={700} pl={theme.spacing(0.5)}>
          {value}
        </Typography>
      </Stack>
    </Card>
  );
};

export default RouteCard;

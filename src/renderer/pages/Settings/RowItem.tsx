import { FormControl, Stack, Typography, useTheme } from '@mui/material';

interface IRowItem {
  label: string;
  children: React.ReactNode;
  hasMargin?: boolean;
}

const RowItem: React.FC<IRowItem> = (props: IRowItem) => {
  const { label, children, hasMargin } = props;
  const theme = useTheme();
  const LABEL_WIDTH: string = theme.spacing(28);
  return (
    <Stack flex={1} flexDirection="row" px={theme.spacing(1)} py={theme.spacing(2)}>
      <FormControl margin={hasMargin ? 'dense' : 'none'} sx={{ width: LABEL_WIDTH }}>
        <Typography variant="subtitle2" fontWeight={800} color={theme.palette.text.primary}>
          {label}
        </Typography>
      </FormControl>
      {children}
    </Stack>
  );
};
RowItem.defaultProps = {
  hasMargin: true,
};

export default RowItem;

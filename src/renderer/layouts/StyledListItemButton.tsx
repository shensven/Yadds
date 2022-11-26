import { ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import { useAtom } from 'jotai';
import { atomPersistenceSidebarCategory, SidebarCategory } from '../atoms/atomUI';
import useNav from '../utils/useNav';

export interface Category {
  path: SidebarCategory;
  tasksLength: number;
  name: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
}

interface Props {
  category?: Category;
}

const defaultProps: { category: Category } = {
  category: {
    path: '/queueAll',
    tasksLength: 0,
    name: 'All',
    activeIcon: <div />,
    inactiveIcon: <div />,
  },
};

function StyledListItemButton({ category = defaultProps.category }: Props) {
  const theme = useTheme();
  const { navigate } = useNav();

  const [sidebarCategory] = useAtom(atomPersistenceSidebarCategory);

  return (
    <ListItemButton disableRipple selected={sidebarCategory === category.path} onClick={() => navigate(category.path)}>
      <ListItemIcon
        sx={{
          minWidth: theme.spacing(4),
          color: sidebarCategory === category.path ? theme.palette.primary.main : theme.palette.text.primary,
        }}
      >
        {sidebarCategory === category.path ? category.activeIcon : category.inactiveIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            noWrap
            color={sidebarCategory === category.path ? theme.palette.primary.main : theme.palette.text.primary}
            fontSize={13}
            fontWeight={500}
            sx={{ mr: theme.spacing(0.5) }}
          >
            {category.name}
          </Typography>
        }
      />
      {category.tasksLength > 0 && (
        <Stack
          justifyContent="center"
          alignItems="center"
          height={theme.spacing(2)}
          minWidth={theme.spacing(3)}
          sx={{
            backgroundColor: theme.palette.text.secondary,
            borderRadius: theme.spacing(1),
            px: category.tasksLength >= 100 ? theme.spacing(0.25) : 0,
          }}
        >
          <Typography
            fontSize={10}
            fontWeight={500}
            color={theme.palette.card.default}
            sx={{ fontFamily: 'Noto Sans Mono' }}
          >
            {category.tasksLength >= 100 ? '99+' : category.tasksLength}
          </Typography>
        </Stack>
      )}
    </ListItemButton>
  );
}

StyledListItemButton.defaultProps = defaultProps;

export default StyledListItemButton;

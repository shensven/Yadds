import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material';
import IcRoundDelete from '@/renderer/assets/icons/IcRoundDelete';
import { atomHasDialogAddressRemover, atomWhoWillRemove } from '@/renderer/atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '@/renderer/atoms/atomConnectedUsers';

const DialogAddressRemover: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [connectedUsers, setConnectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [, setTargetDid] = useAtom(atomPersistenceTargetDid);

  const [hasDialogAddressRemover, setHasDialogAddressRemover] = useAtom(atomHasDialogAddressRemover);
  const [whoWillRemove, setWhoWillRemove] = useAtom(atomWhoWillRemove);

  const dismissDialogRemove = () => {
    setHasDialogAddressRemover(false);
    setWhoWillRemove(-1);
  };

  const handleRemove = () => {
    if (connectedUsers.length === 1) {
      setTargetDid('');
      setConnectedUsers([]);
    } else if (whoWillRemove === connectedUsers.length - 1) {
      const prevUser = connectedUsers[whoWillRemove - 1];
      setTargetDid(prevUser.did);

      const arr = [...connectedUsers];
      arr.splice(whoWillRemove, 1);
      setConnectedUsers(arr);
    } else {
      const nextUser = connectedUsers[whoWillRemove + 1];
      setTargetDid(nextUser.did);

      const arr = [...connectedUsers];
      arr.splice(whoWillRemove, 1);
      setConnectedUsers(arr);
    }

    setHasDialogAddressRemover(false);
  };

  return (
    <Dialog
      keepMounted
      open={hasDialogAddressRemover}
      PaperProps={{
        sx: { width: theme.spacing(32), height: theme.spacing(24) },
      }}
      onClose={() => dismissDialogRemove()}
    >
      <DialogTitle>
        <Stack flexDirection="row" alignItems="center">
          <IcRoundDelete sx={{ color: theme.palette.text.secondary, ml: theme.spacing(-0.5) }} />
          <Typography
            noWrap
            variant="subtitle2"
            color={theme.palette.text.secondary}
            sx={{ fontWeight: 500, ml: theme.spacing(1) }}
          >
            {t('preferences.dialog_remover.confirm_remove')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack height="100%" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {t('preferences.dialog_remover.are_you_sure')}
          </Typography>

          <Button
            color="warning"
            sx={{
              height: theme.spacing(5),
              mt: theme.spacing(2),
              backgroundColor: theme.palette.input.default,
              '&:hover': { backgroundColor: theme.palette.input.hover },
            }}
            onClick={() => handleRemove()}
          >
            <Typography fontWeight={500} sx={{ fontSize: 12 }}>
              {t('preferences.dialog_remover.yes')}
            </Typography>
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddressRemover;

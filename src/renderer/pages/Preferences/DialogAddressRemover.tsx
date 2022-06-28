import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material';
import IonTrashOutline from '../../assets/icons/IonTrashOutline';
import { atomHasDialogAddressRemover, atomWhoWillRemove } from '../../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../../atoms/atomConnectedUsers';

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
    <Dialog keepMounted open={hasDialogAddressRemover} onClose={() => dismissDialogRemove()}>
      <DialogTitle>
        <Stack flexDirection="row" alignItems="center">
          <Typography>{t('preferences.dialog_remove.confirm_remove')}</Typography>
          <IonTrashOutline sx={{ fontSize: 17, ml: theme.spacing(1) }} />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography color={theme.palette.text.secondary} sx={{ fontSize: 14, width: theme.spacing(28) }}>
          {t('preferences.dialog_remove.are_you_sure')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => dismissDialogRemove()}>
          {t('preferences.dialog_remove.cancel')}
        </Button>
        <Button color="error" onClick={() => handleRemove()}>
          {t('preferences.dialog_remove.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAddressRemover;

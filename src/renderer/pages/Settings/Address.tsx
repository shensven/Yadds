import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import {
  Button,
  FormControl,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import RowItem from './RowItem';
import IonTrashOutline from '../../assets/icons/IonTrashOutline';
import { atomHasDialogAddressAdder, atomHasDialogAddressRemover, atomWhoWillRemove } from '../../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../../atoms/atomConnectedUsers';

const Address: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid, setTargetDid] = useAtom(atomPersistenceTargetDid);
  const [, setHasDialogAddressAdder] = useAtom(atomHasDialogAddressAdder);
  const [, setHasDialogAddressRemover] = useAtom(atomHasDialogAddressRemover);
  const [, setWhoWillRemove] = useAtom(atomWhoWillRemove);

  const [hasSelecterForAddress, setHasSelecterForAddress] = useState(false);

  const handleAddress = (did: string, menuItemIndex: number, isDelete: boolean) => {
    if (isDelete) {
      setWhoWillRemove(menuItemIndex);
      setHasSelecterForAddress(false);
      setHasDialogAddressRemover(true);
    } else {
      setTargetDid(did);
      setHasSelecterForAddress(false);
    }
  };

  return (
    <RowItem label={t('settings.quickconnect_id_or_address')}>
      <FormGroup row>
        <FormControl>
          <Select
            size="small"
            displayEmpty
            value={targetDid}
            renderValue={() => (
              <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {targetDid.length === 0 && 'N/A'}
                {targetDid.length > 0 &&
                  `${find(connectedUsers, { did: targetDid })?.username} @ ${
                    find(connectedUsers, { did: targetDid })?.quickConnectID
                  }`}
              </Typography>
            )}
            disabled={connectedUsers.length === 0}
            MenuProps={{
              sx: { minWidth: theme.spacing(36), maxWidth: theme.spacing(36) },
            }}
            sx={{ minWidth: theme.spacing(36), maxWidth: theme.spacing(36), fontSize: 14 }}
            open={hasSelecterForAddress}
            onOpen={() => setHasSelecterForAddress(true)}
            onClose={() => setHasSelecterForAddress(false)}
          >
            {connectedUsers.map((item, index) => (
              <MenuItem key={item.did} dense disableRipple value={item.did}>
                <Stack width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                    onClick={() => handleAddress(item.did, index, false)}
                  >
                    {item.username} @ {item.quickConnectID}
                  </Typography>
                  <IconButton sx={{ width: 20, height: 20 }} onClick={() => handleAddress(item.did, index, true)}>
                    <IonTrashOutline sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size="small"
          sx={{ ml: theme.spacing(1), px: theme.spacing(1) }}
          onClick={() => setHasDialogAddressAdder(true)}
        >
          {t('settings.new_connection')}
        </Button>
      </FormGroup>
    </RowItem>
  );
};

export default Address;

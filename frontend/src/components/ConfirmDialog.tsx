import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';

interface Props {
  message: string;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
}

/**
 * This renders a confirmation dialog to confirm an action.
 */
export const ConfirmDialog = (props: Props) => {
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{props.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onCancel} variant="contained">
          Cancel
        </Button>
        <Button color="secondary" onClick={props.onConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

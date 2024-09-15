import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

export const ConfirmDialog = (props: {
  title: string
  message: string
  isDialogOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}): JSX.Element => {
  return (
    <Dialog open={props.isDialogOpen} onClose={props.onCancel}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={props.onConfirm}>O K</Button>
      </DialogActions>
    </Dialog>
  )
}

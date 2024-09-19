import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { t } from 'i18next'
import { useState } from 'react'
import { useToggle } from 'react-use'
import { MosaicsProp } from '../models/NemesisProperties'

export const NemesisMosaicDialog = (props: {
  mosaic: MosaicsProp
  isDialogOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}): JSX.Element => {
  const [supplyUnits, setSupplyUnits] = useState('0')
  const [supplyUnitsErr, setSupplyUnitsErr] = useToggle(false)
  const [supplyUnitsErrMsg, setSupplyUnitsErrMsg] = useState('')
  const [divisibility, setDivisibility] = useState('0')
  const [divisibilityErr, setDivisibilityErr] = useToggle(false)
  const [divisibilityErrMsg, setDivisibilityErrMsg] = useState('')
  const [supply, setSupply] = useState('0')
  const [isTransferable, setIsTransferable] = useToggle(false)
  const [isSupplyMutable, setIsSupplyMutable] = useToggle(false)
  const [isRestrictable, setIsRestrictable] = useToggle(false)
  const [isDisabledSupplyUnits, setIsDisabledSupplyUnits] = useToggle(true)
  const [isDisabledDivisibility, setIsDisabledDivisibility] = useToggle(true)
  const [isDisabledTransferable, setIsDisabledTransferable] = useToggle(true)
  const [isDisabledSupplyMutable, setIsDisabledSupplyMutable] = useToggle(true)
  const [isDisabledRestrictable, setIsDisabledRestrictable] = useToggle(true)

  return (
    <Dialog
      open={props.isDialogOpen}
      onClose={props.onCancel}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          // // 重複チェック
          // if (namespaceName !== namespaceCurrentName) {
          //   const findName =
          //     namespaceParentsName === 'none'
          //       ? namespaceName
          //       : `${namespaceParentsName}.${namespaceName}`
          //   const findNs = findNamespace(prop.namespaces, findName)
          //   if (findNs) {
          //     setNamespaceNameErr(true)
          //     setNamespaceNameErrMsg(t('Existing namespace'))
          //     return
          //   } else {
          //     setNamespaceNameErr(false)
          //     setNamespaceNameErrMsg('')
          //   }
          // }
          // const formData = new FormData(event.currentTarget)
          // const formJson = Object.fromEntries(formData.entries())
          // const email = formJson.email
          // console.log(email)
          // confirmNamespaceDialog()
          // handleClose()
        },
      }}
    >
      <DialogTitle>Mosaic</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={1}>
          <Grid2 size={12} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel size="small">Age</InputLabel>
              <Select
                size="small"
                // value={age}
                label="Age"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={9}>
            <TextField
              label={t('Supply Units')}
              variant="outlined"
              size="small"
              value={supplyUnits}
              error={supplyUnitsErr}
              helperText={supplyUnitsErrMsg}
              disabled={isDisabledSupplyUnits}
              onChange={(e) => setSupplyUnits(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              label={t('Divisibility')}
              variant="outlined"
              size="small"
              value={divisibility}
              error={divisibilityErr}
              helperText={divisibilityErrMsg}
              disabled={isDisabledDivisibility}
              onChange={(e) => setDivisibility(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label={t('Supply')}
              variant="standard"
              size="small"
              value={supply}
              disabled
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  defaultChecked={isTransferable}
                  disabled={isDisabledTransferable}
                />
              }
              label={t('Transferable')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  defaultChecked={isSupplyMutable}
                  disabled={isDisabledSupplyMutable}
                />
              }
              label={t('Supply mutable')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  defaultChecked={isRestrictable}
                  disabled={isDisabledRestrictable}
                />
              }
              label={t('Restrictable')}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button type="submit">OK</Button>
      </DialogActions>
    </Dialog>
  )
}

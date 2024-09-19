import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'
import { NamespacesProp, NemesisProperties } from '../models/NemesisProperties'
import { ConfirmDialog } from './ConfirmDialog'

/**
 * ネームスペース検索
 * @param nss  ネームスペース配列
 * @param findName 検索ネームスペース
 * @returns NamespacesProp
 */
const findNamespace = (nss: NamespacesProp[], findName: string) => {
  const findNames = findName.split('.')
  const nsLv1 = nss.filter((val) => {
    if (val.name === findNames[0]) return true
    return false
  })[0]
  if (findNames.length === 1) return nsLv1
  const nsLv2 = nsLv1.children.filter((val) => {
    if (val.name === findNames[1]) return true
    return false
  })[0]
  if (findNames.length === 2) return nsLv2
  return nsLv2.children.filter((val) => {
    if (val.name === findNames[2]) return true
    return false
  })[0]
}

/**
 * ネームスペース削除
 * @param nss  ネームスペース配列
 * @param findName 検索ネームスペース
 * @returns NamespacesProp[]
 */
const deleteNamespace = (nss: NamespacesProp[], findName: string) => {
  const findNames = findName.split('.')
  for (let i = 0; i < nss.length; i++) {
    if (nss[i].name === findNames[0]) {
      if (findNames.length === 1) {
        nss.splice(i, 1)
      } else {
        for (let j = 0; j < nss[i].children.length; j++) {
          if (nss[i].children[j].name === findNames[1]) {
            if (findNames.length === 2) {
              nss[i].children.splice(j, 1)
            } else {
              for (let k = 0; k < nss[i].children[j].children.length; k++) {
                if (nss[i].children[j].children[k].name === findNames[2]) {
                  nss[i].children[j].children.splice(k, 1)
                }
              }
            }
          }
        }
      }
    }
  }
  return nss
}

/**
 * Nemesisプロパティ画面
 * @param props NemesisProperties
 * @returns JSX.Element
 */
export const Nemesis = (props: {
  nemesisProperties: NemesisProperties
  handleChaingeNemesisProperties: (prop: NemesisProperties) => void
}): JSX.Element => {
  const { t } = useTranslation()
  // const nemesisSingerAccount = createAccount()

  /** nemesis */
  const prop = props.nemesisProperties
  const changeProp = props.handleChaingeNemesisProperties
  const [networkIdentifier, setNetworkIdentifier] = useState(prop.nemesis.networkIdentifier)
  const [nemesisGenerationHashSeed, setNemesisGenerationHashSeed] = useState(
    prop.nemesis.nemesisGenerationHashSeed,
  )
  const [nemesisSignerPrivateKey, setNemesisSignerPrivateKey] = useState(
    prop.nemesis.nemesisSignerAccount.privatekey,
  )

  /** 初期表示 */
  useEffect(() => {
    console.trace('useEffect()[]')
    console.debug(prop)
    setNetworkIdentifier(prop.nemesis.networkIdentifier)
    createNamespaceList()
  }, [])

  /** 項目変更時 */
  useEffect(() => {
    prop.nemesis.networkIdentifier = networkIdentifier
    // prop.nemesis.nemesisGenerationHashSeed = nemesisGenerationHashSeed
    // prop.nemesis.nemesisSignerPrivateKey = nemesisSignerPrivateKey
    changeProp(prop)
  }, [networkIdentifier, nemesisGenerationHashSeed, nemesisSignerPrivateKey])

  /** cpp */
  const [cppFileHeader, setCppFileHeader] = useState(prop.cpp.cppFileHeader)

  /** output */
  const [cppFile, setCppFile] = useState(prop.output.cppFile)
  const [binDirectory, setBinDirectory] = useState(prop.output.binDirectory)

  const listvalue = (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemIcon>
        <AccountBalanceWalletIcon />
      </ListItemIcon>
      <ListItemText primary="hogehoge" />
    </ListItem>
  )

  /** namespaces */
  // リストビュー作成
  const [namespaceList, setNamespaceList] = useState<JSX.Element[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useToggle(false)
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('')
  const [deleteDialogMessage, setDeleteDialogMessage] = useState('')
  const [deleteNamespaceKey, setDeleteNamespaceKey] = useState('')
  const createNamespaceList = () => setNamespaceList(createNamespaceList2())
  const createNamespaceList2 = (
    children?: NamespacesProp[],
    parents: string = '',
    level: number = 0,
  ) => {
    const nsArray = children ?? prop.namespaces
    const tmpJsxElements: JSX.Element[] = []
    const padding = level * 4
    const paddingNext = (level + 1) * 4
    for (const ns of nsArray) {
      const p = parents !== '' ? `${parents}.${ns.name}` : ns.name
      const tmps = ns.children.length !== 0 ? createNamespaceList2(ns.children, p, level + 1) : []
      const itemIcon = <LocalOfferIcon />
      const subText = ''
      tmpJsxElements.push(
        <ListItem
          key={`namespace-${p}`}
          secondaryAction={
            <IconButton edge="end" onClick={() => openDeleteDialog(p)}>
              <DeleteIcon />
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton
            sx={{ p: 0, pl: padding }}
            onClick={() => handleClickNamespaceOpen(parents, ns.name)}
          >
            <ListItemIcon>{itemIcon}</ListItemIcon>
            <ListItemText primary={ns.name} secondary={subText} />
          </ListItemButton>
        </ListItem>,
      )
      if (level < 2) {
        tmpJsxElements.push(
          <List key={`namespace-add-${p}`} component="div" disablePadding>
            {tmps}
            <ListItemButton
              sx={{ p: 0, pl: paddingNext }}
              onClick={() => handleClickNamespaceOpen(p, '')}
            >
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={`Add to ${p}`} />
            </ListItemButton>
          </List>,
        )
      }
    }
    return tmpJsxElements
  }
  // 削除確認ダイアログ開く
  const openDeleteDialog = (nsName: string) => {
    setDeleteNamespaceKey(nsName)
    setDeleteDialogTitle(t('Delete namespace'))
    setDeleteDialogMessage(t(`Deletes ${nsName}`))
    setIsDeleteDialogOpen(true)
  }
  // 削除確認ダイアログOK
  const onDeleteDialogConfirm = () => {
    console.log(deleteNamespaceKey + ' delete data!!!!')
    prop.namespaces = deleteNamespace(prop.namespaces, deleteNamespaceKey)
    changeProp(prop)
    setIsDeleteDialogOpen(false)
    setDeleteNamespaceKey('')
    console.log(prop.namespaces)
    createNamespaceList()
  }
  // 削除確認ダイアログキャンセル
  const onDeleteDialogCancel = () => setIsDeleteDialogOpen(false)

  /** ネームスペース＆モザイクダイアログ */
  const [namespaceDialogOpen, setNamespaceDialogOpen] = useState(false)
  const [namespaceParentsName, setNamespaceParentsName] = useState('')
  const [namespaceName, setNamespaceName] = useState('')
  const [namespaceNameErr, setNamespaceNameErr] = useToggle(false)
  const [namespaceNameErrMsg, setNamespaceNameErrMsg] = useState('')
  const [namespaceCurrentName, setNamespaceCurrentName] = useState('')

  const [isMosaic, setIsMosaic] = useToggle(false)
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
  const [isDisabledSupplyUnits, setIsDisabledSupplyUnits] = useState(true)
  const [isDisabledDivisibility, setIsDisabledDivisibility] = useState(true)
  const [isDisabledTransferable, setIsDisabledTransferable] = useToggle(true)
  const [isDisabledSupplyMutable, setIsDisabledSupplyMutable] = useToggle(true)
  const [isDisabledRestrictable, setIsDisabledRestrictable] = useToggle(true)

  // ダイアログ開く
  const handleClickNamespaceOpen = (parents: string, nsCurrentName: string) => {
    console.log(`${parents}:${nsCurrentName}`)
    setNamespaceParentsName(parents === '' ? 'none' : parents)
    setNamespaceName(nsCurrentName)
    setNamespaceCurrentName(nsCurrentName)
    // setIsMosaic(false)
    // setSupplyUnits('8999999999000000')
    // setDivisibility('6')
    // setSupply('8999999999.000000')
    // setIsTransferable(true)
    // setIsSupplyMutable(false)
    // setIsRestrictable(false)
    // setIsDisabledSupplyUnits(true)
    // setIsDisabledDivisibility(true)
    // setIsDisabledTransferable(true)
    // setIsDisabledSupplyMutable(true)
    // setIsDisabledRestrictable(true)
    setNamespaceNameErr(false)
    setNamespaceNameErrMsg('')
    // if (nsCurrentName !== '') {
    // const findName = parents === '' ? nsCurrentName : `${parents}.${nsCurrentName}`
    // const ns = findNamespace(prop.namespaces, findName)
    // const isMosaic = ns.mosaic ? true : false
    // setIsMosaic(isMosaic)
    // if (isMosaic) {
    // setSupplyUnits(ns.mosaic!.supply.replace(/\./g, ''))
    // setDivisibility(ns.mosaic!.divisibility.toString())
    // setSupply(ns.mosaic!.supply)
    // setIsTransferable(ns.mosaic!.isTransferable)
    // setIsSupplyMutable(ns.mosaic!.isSupplyMutable)
    // setIsRestrictable(ns.mosaic!.isRestrictable)
    //   setIsDisabledSupplyUnits(false)
    //   setIsDisabledDivisibility(false)
    //   setIsDisabledTransferable(false)
    //   setIsDisabledSupplyMutable(true)
    //   setIsDisabledRestrictable(true)
    // }
    // }
    setNamespaceDialogOpen(true)
  }
  // ダイアログ閉じる
  const handleNamespaceClose = () => setNamespaceDialogOpen(false)
  // ダイアログ確定
  const confirmNamespaceDialog = () => {
    if (namespaceCurrentName === '') {
      let rootNs: NamespacesProp[]
      // 新規作成
      if (namespaceParentsName === 'none') {
        // 最上位
        rootNs = prop.namespaces
      } else {
        const ns = findNamespace(prop.namespaces, namespaceParentsName)
        rootNs = ns.children
      }
      const newNs: NamespacesProp = {
        name: namespaceName,
        duration: 0,
        children: [],
      }
      rootNs.push(newNs)
    } else {
      // 変更
      const findName =
        namespaceParentsName === 'none'
          ? namespaceCurrentName
          : `${namespaceParentsName}.${namespaceCurrentName}`
      const ns = findNamespace(prop.namespaces, findName)
      ns.name = namespaceName
    }
    createNamespaceList()
  }
  // 供給量計算
  useEffect(() => {
    // 可分性変
    const numDivisibility = Number(divisibility)
    if (isNaN(numDivisibility)) {
      setDivisibilityErr(true)
      setDivisibilityErrMsg(t('Enter numerical value.'))
    } else if (0 <= numDivisibility && numDivisibility <= 6) {
      setDivisibilityErr(false)
      setDivisibilityErrMsg('')
    } else {
      setDivisibilityErr(true)
      setDivisibilityErrMsg('0 <= val <= 6')
      return
    }
    // 供給単位
    try {
      BigInt(supplyUnits)
      setSupplyUnitsErr(false)
      setSupplyUnitsErrMsg('')
      const tmpSupply = supplyUnits.padStart(numDivisibility + 1, '0')
      const regExp = new RegExp('(\\d+)(\\d{' + divisibility + '})$', 'g')
      console.log(regExp)
      const dotSupply = tmpSupply.replaceAll(regExp, '$1.$2')
      setSupply(dotSupply)
    } catch {
      setSupplyUnitsErr(true)
      setSupplyUnitsErrMsg(t('Enter numerical value.'))
      setSupply('Error')
    }
  }, [supplyUnits, divisibility])

  /** mosaics */
  const [mosaicsDialogOpen, setMosaicsDialogOpen] = useState(false)
  // ダイアログ開く
  const handleClickMosaicsOpen = (parents: string, nsCurrentName: string) => {
    setMosaicsDialogOpen(true)
  }
  // ダイアログ閉じる
  const handleMosaicsClose = () => setMosaicsDialogOpen(false)

  /** distribution */
  const [distributionDialogOpen, setDistributionDialogOpen] = useState(false)
  // ダイアログ開く
  const handleClickDistributionOpen = (parents: string, nsCurrentName: string) => {
    setDistributionDialogOpen(true)
  }
  // ダイアログ閉じる
  const handleDistributionClose = () => setDistributionDialogOpen(false)

  /** transactions */
  const [txDirectory, setTxDirectory] = useState(prop.transactions.transactionsDirectory)

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            nemesis
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">networkIdentifier</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisNetworkIdentifierDescribe')}
          </Typography>
          <TextField
            id="networkIdentifier"
            variant="outlined"
            size="small"
            type="number"
            sx={{ width: 120 }}
            onChange={(e) => setNetworkIdentifier(Number(e.target.value))}
            value={networkIdentifier}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">nemesisGenerationHashSeed</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisNemesisGenerationHashSeedDescribe')}
          </Typography>
          <TextField
            id="nemesisGenerationHashSeed"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setNemesisGenerationHashSeed(e.target.value)}
            value={nemesisGenerationHashSeed}
            disabled
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">nemesisSignerPrivateKey</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisNemesisSignerPrivateKeyDescribe')}
          </Typography>
          <TextField
            id="nemesisSignerPrivateKey"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setNemesisSignerPrivateKey(e.target.value)}
            value={nemesisSignerPrivateKey}
            disabled
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            cpp
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFileHeader</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisCppFileHeaderDescribe')}
          </Typography>
          <TextField
            id="cppFileHeader"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setCppFileHeader(e.target.value)}
            value={cppFileHeader}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            output
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFile</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisCppFileDescribe')}
          </Typography>
          <TextField
            id="cppFile"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setCppFile(e.target.value)}
            value={cppFile}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">binDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisBinDirectoryDescribe')}
          </Typography>
          <TextField
            id="binDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setBinDirectory(e.target.value)}
            value={binDirectory}
          />
        </Grid2>

        {/* ===== ネームスペース ===== */}
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            namespaces
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisNamespacesDescribe')}
          </Typography>
          <List sx={{ width: '800px' }} component="nav" disablePadding>
            {namespaceList}
            <ListItemButton sx={{ p: 0 }} onClick={() => handleClickNamespaceOpen('', '')}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add to top-level" />
            </ListItemButton>
          </List>
        </Grid2>

        {/* ===== モザイク ===== */}
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            mosaics
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisMosaicsDescribe')}
          </Typography>
          <List
            sx={{ width: '800px' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            disablePadding
          >
            <ListItemButton sx={{ p: 0 }} onClick={() => handleClickMosaicsOpen('', '')}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add mosaic" />
            </ListItemButton>
          </List>
        </Grid2>

        {/* ===== トランザクションディレクトリ ===== */}
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            transactions
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <Typography variant="h6">transactionsDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t('nemesisTransactionsDirectoryDescribe')}
          </Typography>
          <TextField
            id="transactionsDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setTxDirectory(e.target.value)}
            value={txDirectory}
          />
        </Grid2>
      </Grid2>

      {/* ===== ネームスペース追加ダイアログ ===== */}
      <Dialog
        open={namespaceDialogOpen}
        onClose={handleNamespaceClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            // 重複チェック
            if (namespaceName !== namespaceCurrentName) {
              const findName =
                namespaceParentsName === 'none'
                  ? namespaceName
                  : `${namespaceParentsName}.${namespaceName}`
              const findNs = findNamespace(prop.namespaces, findName)
              if (findNs) {
                setNamespaceNameErr(true)
                setNamespaceNameErrMsg(t('Existing namespace'))
                return
              } else {
                setNamespaceNameErr(false)
                setNamespaceNameErrMsg('')
              }
            }
            confirmNamespaceDialog()
            handleNamespaceClose()
          },
        }}
      >
        <DialogTitle>Namespace</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={1}>
            <Grid2 size={12}>
              <DialogContentText>
                {t('Parent')}: {namespaceParentsName}
              </DialogContentText>
            </Grid2>
            <Grid2 size={12}>
              <TextField
                autoFocus
                required
                id="namespace-name"
                name="namespace-name"
                label="Namespace Name"
                size="small"
                variant="outlined"
                value={namespaceName}
                error={namespaceNameErr}
                helperText={namespaceNameErrMsg}
                onChange={(e) => setNamespaceName(e.target.value)}
                fullWidth
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNamespaceClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>

      {/* ===== モザイク追加ダイアログ ===== */}
      <Dialog
        open={mosaicsDialogOpen}
        onClose={handleMosaicsClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            // 重複チェック
            if (namespaceName !== namespaceCurrentName) {
              const findName =
                namespaceParentsName === 'none'
                  ? namespaceName
                  : `${namespaceParentsName}.${namespaceName}`
              const findNs = findNamespace(prop.namespaces, findName)
              if (findNs) {
                setNamespaceNameErr(true)
                setNamespaceNameErrMsg(t('Existing namespace'))
                return
              } else {
                setNamespaceNameErr(false)
                setNamespaceNameErrMsg('')
              }
            }
            // const formData = new FormData(event.currentTarget)
            // const formJson = Object.fromEntries(formData.entries())
            // const email = formJson.email
            // console.log(email)
            confirmNamespaceDialog()
            // handleClose()
          },
        }}
      >
        <DialogTitle>Mosaic</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={1}>
            <Grid2 size={12} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel size="small">Namespace</InputLabel>
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
          <Button onClick={handleNamespaceClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>

      {/* ===== モザイク配布先追加ダイアログ ===== */}
      <Dialog
        open={distributionDialogOpen}
        onClose={handleDistributionClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            // 重複チェック
            if (namespaceName !== namespaceCurrentName) {
              const findName =
                namespaceParentsName === 'none'
                  ? namespaceName
                  : `${namespaceParentsName}.${namespaceName}`
              const findNs = findNamespace(prop.namespaces, findName)
              if (findNs) {
                setNamespaceNameErr(true)
                setNamespaceNameErrMsg(t('Existing namespace'))
                return
              } else {
                setNamespaceNameErr(false)
                setNamespaceNameErrMsg('')
              }
            }
            // const formData = new FormData(event.currentTarget)
            // const formJson = Object.fromEntries(formData.entries())
            // const email = formJson.email
            // console.log(email)
            confirmNamespaceDialog()
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
            <Grid2 size={12}>
              <Typography gutterBottom variant="h6" component="div">
                {t('Distribution')}
              </Typography>
            </Grid2>
            <Grid2 size={12} sx={{ my: 0 }}>
              <Divider />
            </Grid2>
            <Grid2 size={12} sx={{ my: 0 }}>
              <List component="div" disablePadding>
                {listvalue}
                <ListItemButton
                  sx={{ p: 0 }}
                  // onClick={() => handleClickOpen(p, '')}
                >
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add" />
                </ListItemButton>
              </List>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNamespaceClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>

      {/* ===== 削除確認ダイアログ ===== */}
      <ConfirmDialog
        isDialogOpen={isDeleteDialogOpen}
        title={deleteDialogTitle}
        message={deleteDialogMessage}
        onConfirm={onDeleteDialogConfirm}
        onCancel={onDeleteDialogCancel}
      />
    </>
  )
}

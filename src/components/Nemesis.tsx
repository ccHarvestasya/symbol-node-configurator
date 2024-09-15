import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import DonutSmallIcon from '@mui/icons-material/DonutSmall'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { sha3_256 } from '@noble/hashes/sha3'
import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'
import { Account } from '../models/Account'
import { NamepsacesProp, NemesisProperties } from '../models/NemesisProperties'
const childProcess = window.require('child_process')

const createSHA3_256Hash = () => {
  const seed = crypto.getRandomValues(new Uint8Array(20))
  const sha3 = sha3_256.create()
  const hash = sha3.update(seed)
  return Buffer.from(hash.digest()).toString('hex').toUpperCase()
}

const createAccount = () => {
  const stdout = childProcess.execSync(
    'docker exec -i symbol-server /usr/catapult/bin/catapult.tools.addressgen -f csv -c 1',
  )
  const csv = stdout.toString().split('\n')[7].split(',')
  return new Account(csv[0], csv[2], csv[3], csv[4])
}

const findNamespace = (nss: NamepsacesProp[], findName: string) => {
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

  /** nemesisプロパティ初期化 */
  const prop = props.nemesisProperties
  const changeProp = props.handleChaingeNemesisProperties
  const [networkIdentifier, setNetworkIdentifier] = useState(prop.nemesis.networkIdentifier)
  const [nemesisGenerationHashSeed, setNemesisGenerationHashSeed] = useState(
    prop.nemesis.nemesisGenerationHashSeed,
  )
  const [nemesisSignerPrivateKey, setNemesisSignerPrivateKey] = useState(
    prop.nemesis.nemesisSignerPrivateKey,
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
    console.log(prop)
    prop.nemesis.networkIdentifier = networkIdentifier
    prop.nemesis.nemesisGenerationHashSeed = nemesisGenerationHashSeed
    prop.nemesis.nemesisSignerPrivateKey = nemesisSignerPrivateKey
    changeProp(prop)
  }, [networkIdentifier, nemesisGenerationHashSeed, nemesisSignerPrivateKey])

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

  /** ネームスペース＆モザイクリスト */
  const createNamespaceList2 = (
    children?: NamepsacesProp[],
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
      let itemIcon = <LocalOfferIcon />
      let subText = ''
      if (ns.mosaic) {
        itemIcon = <DonutSmallIcon />
        subText += `supply: ${ns.mosaic.supply}`
        subText += ns.mosaic.isTransferable ? ` / Transferable` : ''
        subText += ns.mosaic.isSupplyMutable ? ` / SupplyMutable` : ''
        subText += ns.mosaic.isRestrictable ? ` / Restrictable` : ''
        subText += ns.mosaic.isRevokable ? ` / Revokable` : ''
      }
      tmpJsxElements.push(
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton
            sx={{ p: 0, pl: padding }}
            onClick={() => handleClickOpen(parents, ns.name)}
          >
            <ListItemIcon>{itemIcon}</ListItemIcon>
            <ListItemText primary={ns.name} secondary={subText} />
          </ListItemButton>
        </ListItem>,
      )
      if (level < 2) {
        tmpJsxElements.push(
          <List component="div" disablePadding>
            {tmps}
            <ListItemButton sx={{ p: 0, pl: paddingNext }} onClick={() => handleClickOpen(p, '')}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add" secondary={`Add to ${p}`} />
            </ListItemButton>
          </List>,
        )
      }
    }
    return tmpJsxElements
  }

  const [namespaceList, setNamespaceList] = useState<JSX.Element[]>([])
  const createNamespaceList = () => {
    setNamespaceList(createNamespaceList2())
  }

  /** ネームスペース＆モザイクダイアログ */
  const [open, setOpen] = useState(false)
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
  const handleClickOpen = (parents: string, nsCurrentName: string) => {
    console.log(`${parents}:${nsCurrentName}`)
    setNamespaceParentsName(parents === '' ? 'none' : parents)
    setNamespaceName(nsCurrentName)
    setNamespaceCurrentName(nsCurrentName)
    setIsMosaic(false)
    setSupplyUnits('8999999999000000')
    setDivisibility('6')
    setSupply('8999999999.000000')
    setIsTransferable(true)
    setIsSupplyMutable(false)
    setIsRestrictable(false)
    setIsDisabledSupplyUnits(true)
    setIsDisabledDivisibility(true)
    setIsDisabledTransferable(true)
    setIsDisabledSupplyMutable(true)
    setIsDisabledRestrictable(true)
    setNamespaceNameErr(false)
    setNamespaceNameErrMsg('')
    if (nsCurrentName !== '') {
      const findName = parents === '' ? nsCurrentName : `${parents}.${nsCurrentName}`
      const ns = findNamespace(prop.namespaces, findName)
      const isMosaic = ns.mosaic ? true : false
      setIsMosaic(isMosaic)
      if (isMosaic) {
        setSupplyUnits(ns.mosaic!.supply.replace(/\./g, ''))
        setDivisibility(ns.mosaic!.divisibility.toString())
        setSupply(ns.mosaic!.supply)
        setIsTransferable(ns.mosaic!.isTransferable)
        setIsSupplyMutable(ns.mosaic!.isSupplyMutable)
        setIsRestrictable(ns.mosaic!.isRestrictable)
        setIsDisabledSupplyUnits(false)
        setIsDisabledDivisibility(false)
        setIsDisabledTransferable(false)
        setIsDisabledSupplyMutable(true)
        setIsDisabledRestrictable(true)
      }
    }
    setOpen(true)
  }
  // ダイアログ閉じる
  const handleClose = () => setOpen(false)
  // モザイク有無スイッチ
  const handleChangeMosaicSwitch = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setIsDisabledSupplyUnits(false)
      setIsDisabledDivisibility(false)
      setIsDisabledTransferable(false)
      // setIsDisabledSupplyMutable(false)
      // setIsDisabledRestrictable(false)
    } else {
      setIsDisabledSupplyUnits(true)
      setIsDisabledDivisibility(true)
      setIsDisabledTransferable(true)
      setIsDisabledSupplyMutable(true)
      setIsDisabledRestrictable(true)
    }
  }
  // ダイアログ確定
  const confirmDialog = () => {
    if (namespaceCurrentName === '') {
      let rootNs: NamepsacesProp[]
      // 新規作成
      if (namespaceParentsName === 'none') {
        // 最上位
        rootNs = prop.namespaces
      } else {
        const ns = findNamespace(prop.namespaces, namespaceParentsName)
        rootNs = ns.children
      }
      const newNs: NamepsacesProp = {
        name: namespaceName,
        duration: 0,
        children: [],
        mosaic: {
          duration: 0,
          supply: supply,
          divisibility: Number(divisibility),
          isTransferable: isTransferable,
          isSupplyMutable: isSupplyMutable,
          isRestrictable: isRestrictable,
          isRevokable: false,
          distribution: [],
        },
      }
      rootNs.push(newNs)
    } else {
      // 変更
      const ns = findNamespace(prop.namespaces, `${namespaceParentsName}.${namespaceCurrentName}`)
      ns.name = namespaceName
    }

    // const nsParentsNames = namespaceParentsName === 'none' ? [] : namespaceParentsName.split('.')
    // const nsParents = getNsParents(prop.namespaces, nsParentsNames)

    // if (!nsParents) {
    //   const tmpNamespaces = prop.namespaces.filter((val) => {
    //     if (val.name === namespaceName) return true
    //     return false
    //   })
    //   let namespace: NamepsacesProp
    //   if (tmpNamespaces.length !== 0) {
    //     namespace = tmpNamespaces[0]
    //   } else {
    //     namespace = {
    //       name: namespaceName,
    //       duration: 0,
    //       children: [],
    //     }
    //     prop.namespaces.push(namespace)
    //   }
    // } else {
    //   const tmpParentsNamespaces = nsParents.children.filter((val) => {
    //     if (val.name === namespaceName) return true
    //     return false
    //   })
    // }

    console.log(prop)
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
            ネットワークを識別するための値。アドレスの先頭文字が決まる。
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
            ネメシス(ジェネシス)ブロック生成ハッシュシード。ネットワーク毎にユニークな値。
          </Typography>
          <TextField
            id="nemesisGenerationHashSeed"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setNemesisGenerationHashSeed(e.target.value)}
            value={nemesisGenerationHashSeed}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">nemesisSignerPrivateKey</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネメシス(ジェネシス)ブロックに署名するアカウントの秘密鍵。このページで設定するネームスペース、モザイクの所有者。
          </Typography>
          <TextField
            id="nemesisSignerPrivateKey"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
            onChange={(e) => setNemesisSignerPrivateKey(e.target.value)}
            value={nemesisSignerPrivateKey}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            cpp
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFileHeader</Typography>
          <Typography variant="subtitle2" color="textSecondary"></Typography>
          <TextField
            id="cppFileHeader"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            output
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFile</Typography>
          <Typography variant="subtitle2" color="textSecondary"></Typography>
          <TextField id="cppFile" variant="outlined" size="small" type="text" sx={{ width: 800 }} />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">binDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネメシス(ジェネシス)ブロック保存ディレクトリ。作業ディレクトリからの相対パス。
          </Typography>
          <TextField
            id="binDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            namespaces & mosaic
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="subtitle2" color="textSecondary">
            無期限のネームスペースとモザイクを作成。ネームスペースは３階層まで作成可能。
          </Typography>
          <List
            sx={{ width: '800px', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            disablePadding
          >
            {namespaceList}
            <ListItemButton sx={{ p: 0 }} onClick={() => handleClickOpen('', '')}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add" secondary="Add to top-level" />
            </ListItemButton>
          </List>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            transactions
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">transactionsDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            トランザクション保存ディレクトリ。作業ディレクトリからの相対パス。
          </Typography>
          <TextField
            id="transactionsDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>
      </Grid2>

      <Dialog
        open={open}
        onClose={handleClose}
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
            confirmDialog()
            // handleClose()
          },
        }}
      >
        <DialogTitle>Namespace & Mosaic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Parent')}: {namespaceParentsName}
          </DialogContentText>
          <Divider sx={{ my: 1 }} />
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
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Grid2 container spacing={1}>
                <Grid2 size={11}>
                  <Typography gutterBottom variant="h5" component="div">
                    {t('Mosaic')}
                  </Typography>
                </Grid2>
                <Grid2 size={1}>
                  <Switch
                    size="small"
                    onChange={handleChangeMosaicSwitch}
                    defaultChecked={isMosaic}
                  />
                </Grid2>
                <Grid2 size={12} sx={{ my: 0 }}>
                  <Divider />
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
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

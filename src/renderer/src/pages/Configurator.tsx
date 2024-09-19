import { Box, Button, Grid2, Tab, Tabs, TextField } from '@mui/material'
import { sha3_256 } from '@noble/hashes/sha3'
import { t } from 'i18next'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Nemesis } from '../components/Nemesis'
import { NemesisProperties } from '../models/NemesisProperties'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%', padding: '20px', overflowY: 'auto' }}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

const createSHA3_256Hash = () => {
  const seed = crypto.getRandomValues(new Uint8Array(20))
  const sha3 = sha3_256.create()
  const hash = sha3.update(seed)
  return Buffer.from(hash.digest()).toString('hex').toUpperCase()
}

const createAccount = () => {
  // const stdout = childProcess.execSync(
  //   'docker exec -i symbol-server /usr/catapult/bin/catapult.tools.addressgen -f csv -c 1',
  // )
  // const csv = stdout.toString().split('\n')[7].split(',')
  // return new Account(csv[0], csv[2], csv[3], csv[4])
  return 'Address'
}

export const Configurator = (): JSX.Element => {
  const [address, setAddress] = useState('')

  /** nemesisプロパティ */
  const nemesisProp = new NemesisProperties()
  nemesisProp.nemesis.networkIdentifier = Math.floor(Math.random() * 255)
  nemesisProp.nemesis.nemesisGenerationHashSeed = createSHA3_256Hash()
  nemesisProp.nemesis.nemesisSignerAccount = createAccount()
  nemesisProp.cpp.cppFileHeader = ''
  nemesisProp.output.cppFile = ''
  nemesisProp.output.binDirectory = '../seed'
  nemesisProp.namespaces = [
    {
      name: 'symbol',
      duration: 0,
      children: [
        {
          name: 'xym',
          duration: 0,
          // mosaic: {
          //   supply: '7842928625.000000',
          //   divisibility: 6,
          //   duration: 0,
          //   isTransferable: true,
          //   isRestrictable: false,
          //   isSupplyMutable: false,
          //   isRevokable: false,
          //   distribution: [],
          // },
          children: []
        },
        {
          name: 'xym2',
          duration: 0,
          // mosaic: {
          //   supply: '7842928625.000000',
          //   divisibility: 6,
          //   duration: 0,
          //   isTransferable: true,
          //   isRestrictable: false,
          //   isSupplyMutable: false,
          //   isRevokable: false,
          //   distribution: [],
          // },
          children: [
            {
              name: 'xam',
              duration: 0,
              // mosaic: {
              //   supply: '7842928625.000000',
              //   divisibility: 6,
              //   duration: 0,
              //   isTransferable: true,
              //   isRestrictable: false,
              //   isSupplyMutable: false,
              //   isRevokable: false,
              //   distribution: [],
              // },
              children: []
            },
            {
              name: 'xay',
              duration: 0,
              // mosaic: {
              //   supply: '7842928625.000000',
              //   divisibility: 6,
              //   duration: 0,
              //   isTransferable: true,
              //   isRestrictable: false,
              //   isSupplyMutable: false,
              //   isRevokable: false,
              //   distribution: [],
              // },
              children: []
            }
          ]
        }
      ]
    }
  ]
  nemesisProp.mosaics = [
    {
      namespace: 'symbol.xym',
      supplyUnits: '7842928625000000',
      divisibility: '6',
      supply: '7842928625.000000',
      duration: 0,
      isTransferable: true,
      isRestrictable: false,
      isSupplyMutable: false,
      isRevokable: false,
      distribution: []
    }
  ]
  nemesisProp.transactions.transactionsDirectory = '../txes'

  const [nemesisProperties, setNemesisProperties] = useState(nemesisProp)
  const handleChaingeNemesisProperties = (prop: NemesisProperties) => {
    setNemesisProperties(prop)
  }

  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  /** 初期表示 */
  useEffect(() => {}, [])

  return (
    <>
      <div
        style={{
          padding: '5px',
          borderBottom: 'solid 1px #333',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          height: '40px'
        }}
      >
        <Grid2 container spacing={1}>
          <Grid2 size={3}>
            <TextField size="small" variant="standard" defaultValue={t('Profile-1')} fullWidth />
          </Grid2>
          <Grid2 size={0.5}>
            <Button variant="contained" size="small" color="secondary" fullWidth>
              {t('確定')}
            </Button>
          </Grid2>
        </Grid2>
      </div>

      <Box
        sx={{
          pt: 5,
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          height: '100%'
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ width: 200, borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="nemesis" {...a11yProps(0)} />
          <Tab label="database" {...a11yProps(0)} />
          <Tab label="extensions-broker" {...a11yProps(0)} />
          <Tab label="extensions-recovery" {...a11yProps(0)} />
          <Tab label="extensions-server" {...a11yProps(0)} />
          <Tab label="finalization" {...a11yProps(0)} />
          <Tab label="harvesting" {...a11yProps(0)} />
          <Tab label="inflation" {...a11yProps(0)} />
          <Tab label="logging-broker" {...a11yProps(0)} />
          <Tab label="logging-recovery" {...a11yProps(0)} />
          <Tab label="logging-server" {...a11yProps(0)} />
          <Tab label="messaging" {...a11yProps(0)} />
          <Tab label="network" {...a11yProps(0)} />
          <Tab label="networkheight" {...a11yProps(0)} />
          <Tab label="node" {...a11yProps(0)} />
          <Tab label="pt" {...a11yProps(0)} />
          <Tab label="task" {...a11yProps(0)} />
          <Tab label="timesync" {...a11yProps(0)} />
          <Tab label="user" {...a11yProps(0)} />
          <Tab label="api" {...a11yProps(0)} />
          <Tab label="p2p" {...a11yProps(0)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Nemesis
            nemesisProperties={nemesisProperties}
            handleChaingeNemesisProperties={handleChaingeNemesisProperties}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={value} index={4}>
          Item Five
        </TabPanel>
        <TabPanel value={value} index={5}>
          Item Six
        </TabPanel>
        <TabPanel value={value} index={6}>
          Item Seven
        </TabPanel>

        {/* <Box sx={{ border: 'solid' }}>aaa</Box> */}
      </Box>
    </>
  )
}

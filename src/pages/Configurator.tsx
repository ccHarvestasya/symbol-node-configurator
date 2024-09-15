import { Box, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Nemesis } from '../components/Nemesis'
import { NemesisProperties } from '../models/NemesisProperties'
const childProcess = window.require('child_process')

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
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export const Configurator = (): JSX.Element => {
  const [address, setAddress] = useState('')

  /** nemesisプロパティ */
  const nemesisProp = new NemesisProperties()
  nemesisProp.nemesis.networkIdentifier = 109
  nemesisProp.namespaces = [
    {
      name: 'symbol',
      duration: 0,
      children: [
        {
          name: 'xym',
          duration: 0,
          mosaic: {
            supply: '7,842,928,625.000000',
            divisibility: 6,
            duration: 0,
            isTransferable: true,
            isRestrictable: false,
            isSupplyMutable: false,
            isRevokable: false,
            distribution: [],
          },
          children: [],
        },
        {
          name: 'xym2',
          duration: 0,
          mosaic: {
            supply: '7,842,928,625.000000',
            divisibility: 6,
            duration: 0,
            isTransferable: true,
            isRestrictable: false,
            isSupplyMutable: false,
            isRevokable: false,
            distribution: [],
          },
          children: [
            {
              name: 'xam',
              duration: 0,
              mosaic: {
                supply: '7,842,928,625.000000',
                divisibility: 6,
                duration: 0,
                isTransferable: true,
                isRestrictable: false,
                isSupplyMutable: false,
                isRevokable: false,
                distribution: [],
              },
              children: [],
            },
            {
              name: 'xay',
              duration: 0,
              mosaic: {
                supply: '7,842,928,625.000000',
                divisibility: 6,
                duration: 0,
                isTransferable: true,
                isRestrictable: false,
                isSupplyMutable: false,
                isRevokable: false,
                distribution: [],
              },
              children: [],
            },
          ],
        },
      ],
    },
  ]
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
          borderBottom: 'solid 1px #FFF',
          height: 40,
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
        }}
      >
        ヘッダー
      </div>

      <Box
        sx={{
          pt: 5,
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          height: '100%',
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

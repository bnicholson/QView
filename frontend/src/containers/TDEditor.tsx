import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Card from "@mui/material/Card"
import CardHeader from '@mui/material/CardHeader'
import CardContent from "@mui/material/CardContent"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { Breadcrumbs, Link } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab'
import AddIcon from "@mui/icons-material/Add"
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs'
import StickyHeadTable from './GamesTable'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle';

export const DivisionAPI = {
  get: async (page: number, size: number) =>
    await (await fetch(`/api/divisions?page=${page}&page_size=${size}`)).json(),
  create: async (division: string) =>
    await (
      await fetch('/api/divisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: division }),
      })
    ).json(),
  delete: async (id: number) =>
    await fetch(`/api/divisions/${id}`, { method: 'DELETE' }),
  update: async (id: number, division: string) =>
    await fetch(`/api/divisions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: division }),
    }),
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const TDEditor = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [displayDate, setDisplayDate] = React.useState<Date>(new Date())
  const [divisions, setDivisions] = React.useState<Division[]>([])
  const [openDivisionEditor, setDivisionEditorOpen] = React.useState(false);

  const handleEditorClickOpen = () => {
    setDivisionEditorOpen(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    setProcessing(true)
    DivisionAPI.get(0, 25).then((divisions: Division[]) => {
      setDivisions(divisions)
      setProcessing(false)
    })
    console.log("In useeffect - pulling from api")
  }, [displayDate])

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box>
        <Breadcrumbs aria-label="breadcrumb" >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/t/q2022">
            Q2022
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/t/q2022/district%20novice"
          >
            District Novice
          </Link>
          <Typography color="text.primary" onClick={() => navigate("/tdeditor")} >Teams</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Settings" {...a11yProps(0)} />
          <Tab label="Divisions" {...a11yProps(1)} />
          <Tab label="Games/Quizzes" {...a11yProps(2)} />
          <Tab label="Schedule" {...a11yProps(3)} />
          <Tab label="Teams" {...a11yProps(4)} />
          <Tab label="In Progress" {...a11yProps(5)} />
          <Tab label="Other" {...a11yProps(6)} />

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Settings
      </TabPanel>
      <TabPanel value={value} index={1}>
        Divisions
      </TabPanel>
      <TabPanel value={value} index={2}>
        Games/Quizzes
        { StickyHeadTable() }
      </TabPanel>
      <TabPanel value={value} index={3}>
        Schedules
      </TabPanel>
      <TabPanel value={value} index={4}>
        Teams
      </TabPanel>
      <TabPanel value={value} index={5}>
        In Progress
      </TabPanel>
      <TabPanel value={value} index={6}>
        Other
      </TabPanel>

    </div >
  )
}

const test = () => {
  return (
    <ListItem button>
      <ListItemText
        primary="Snake button"
        secondary="Tethys"
      />
    </ListItem>
  )

}
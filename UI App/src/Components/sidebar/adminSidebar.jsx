import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Collapse, Divider } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import styles from './AdminSidebar.module.css'; // Make sure the path to the CSS module is correct

const AdminSidebar = () => {
  const [driverOpen, setDriverOpen] = useState(false); // State for Driver collapsible section
  const [f1HistoryOpen, setF1HistoryOpen] = useState(false); // State for F1 History collapsible section
  const [TeamOpen, setTeamOpen] = useState(false);
  const [TBOpen, setTBOpen] = useState(false);
  const [PollOpen, setPollOpen] = useState(false);
  const [OpenForumOpen, setOpenForumOpen] = useState(false);


  return (
    <Box className={styles.sidebar} sx={{ width:   240 }}>
      <List>
        <ListItem button className={styles.listItem}>
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="HOME" />
        </ListItem>
        <ListItem button className={styles.listItem}>
          <ListItemIcon>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="VIEW PROFILE" />
        </ListItem>
      </List>
      <Divider />

      <List>
        <ListItem button onClick={() => setDriverOpen(!driverOpen)} className={styles.listItem}>
          <ListItemText primary="Driver" />
          <ListItemIcon>
            {driverOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={driverOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={driverOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Driver" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="View Driver List" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      <List>
        <ListItem button onClick={() => setF1HistoryOpen(!f1HistoryOpen)} className={styles.listItem}>
          <ListItemText primary="F1 History" />
          <ListItemIcon>
            {f1HistoryOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={f1HistoryOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={f1HistoryOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add F1 History" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="View F1 History List" />
            </ListItem>
          </List>
        </Collapse>
      </List>


      <List>
        <ListItem button onClick={() => setTeamOpen(!TeamOpen)} className={styles.listItem}>
          <ListItemText primary="Team Management" />
          <ListItemIcon>
            {TeamOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={TeamOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={TeamOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add Team" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="View Team List" />
            </ListItem>
          </List>
        </Collapse>
      </List>



      <List>
        <ListItem button onClick={() => setTBOpen(!TBOpen)} className={styles.listItem}>
          <ListItemText primary="Ticket Management" />
          <ListItemIcon>
            {TBOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={TBOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={TBOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Season" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="List the Season Data" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Race" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="List the Race Data" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Corner" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="List the Corner Data" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add new Ticket Category" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="List the Category data" />
            </ListItem>
          </List>
        </Collapse>
      </List>



      <List>
        <ListItem button onClick={() => setPollOpen(!PollOpen)} className={styles.listItem}>
          <ListItemText primary="Poll" />
          <ListItemIcon>
            {PollOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={PollOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={PollOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Poll" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="View Poll List" />
            </ListItem>
          </List>
        </Collapse>
      </List>



      <List>
        <ListItem button onClick={() => setOpenForumOpen(!OpenForumOpen)} className={styles.listItem}>
          <ListItemText primary="OpenForum" />
          <ListItemIcon>
            {OpenForumOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        </ListItem>
        <Collapse in={OpenForumOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={OpenForumOpen ? styles.activeSection : styles.collapsedSection}>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Topic" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="View Topic List" />
            </ListItem>
            <ListItem button className={styles.listItem}>
              <ListItemIcon>
                <MailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Check Comments" />
            </ListItem>
          </List>
        </Collapse>
      </List>






    </Box>
  );
};

export default AdminSidebar;

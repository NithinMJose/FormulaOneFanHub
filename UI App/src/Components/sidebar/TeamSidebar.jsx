import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, Collapse, Divider } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styles from './TeamSidebar.module.css'; // Make sure the path to the CSS module is correct

const TeamSidebar = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const handleSectionClick = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <Box className={styles.sidebar} sx={{ width: 240 }}>
      <List>
        <ListItem button className={styles.listItem} onClick={() => navigate('/')}>
          <ListItemText primary="HOME" />
        </ListItem>
        <ListItem button className={styles.listItem}onClick={() => navigate('/TeamViewProfile')}>
          <ListItemText primary="VIEW PROFILE" />
        </ListItem>
      </List>
      <Divider />

      <List>
        <ListItem button onClick={() => handleSectionClick('driver')} className={styles.listItem}>
          <ListItemText primary="Driver" />
          {openSection === 'driver' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'driver'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={styles.collapsedSection}>
            <ListItem button className={styles.listItem} onClick={() => navigate('/AddDriverTeam')}>
              <ListItemText primary="Add New Driver" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/DriverListTeam')}>
              <ListItemText primary="View Driver List" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      <List>
        <ListItem button onClick={() => handleSectionClick('teamHistory')} className={styles.listItem}>
          <ListItemText primary="Team History" />
          {openSection === 'teamHistory' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'teamHistory'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={styles.collapsedSection}>
            <ListItem button className={styles.listItem} onClick={() => navigate('/AddTeamHistory')}>
              <ListItemText primary="Add Team History" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/TeamHistoryListTeam')}>
              <ListItemText primary="View Team History List" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      <List>
        <ListItem button onClick={() => handleSectionClick('openForum')} className={styles.listItem}>
          <ListItemText primary="OpenForum" />
          {openSection === 'openForum' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'openForum'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={styles.collapsedSection}>
            <ListItem button className={styles.listItem} onClick={() => navigate('/AddTopicTeam')}>
              <ListItemText primary="Add New Topic" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/TopicListTeam')}>
              <ListItemText primary="View Topic List" />
            </ListItem>
          </List>
        </Collapse>
      </List>


      <List>
        <ListItem button onClick={() => handleSectionClick('store')} className={styles.listItem}>
          <ListItemText primary="Store" />
          {openSection === 'store' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'store'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={styles.collapsedSection}>
            <ListItem button className={styles.listItem} onClick={() => navigate('/AddProductTeam')}>
              <ListItemText primary="Add New Product" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/ProductListTeam')}>
              <ListItemText primary="List the Products" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/TeamSellingHistory')}>
              <ListItemText primary="View Selling History" />
            </ListItem>
            <ListItem button className={styles.listItem} onClick={() => navigate('/TeamSellingReport')}>
              <ListItemText primary="Reort Generation" />
            </ListItem>
            
          </List>
        </Collapse>
      </List>



    </Box>
  );
};

export default TeamSidebar;

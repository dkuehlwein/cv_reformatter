import React from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const IntroContent = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Welcome to the CV Reformatter!
    </Typography>
    <Typography variant="body1" paragraph>
      This tool helps you reformat your CV to match a specific template. Follow these steps:
    </Typography>
    <List>
      <ListItem>
        <ListItemIcon>
          <CheckCircleOutline color="primary" />
        </ListItemIcon>
        <ListItemText primary="Upload your current CV (DOCX format)" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <CheckCircleOutline color="primary" />
        </ListItemIcon>
        <ListItemText primary="Upload the template you want to use (DOCX format)" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <CheckCircleOutline color="primary" />
        </ListItemIcon>
        <ListItemText primary="Optionally, upload an example CV using the template" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <CheckCircleOutline color="primary" />
        </ListItemIcon>
        <ListItemText primary="Click 'Reformat CV' and wait for the magic to happen!" />
      </ListItem>
    </List>
  </Box>
);

export default IntroContent;
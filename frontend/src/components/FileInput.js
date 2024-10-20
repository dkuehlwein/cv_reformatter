import React from 'react';
import {
  Typography,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { Help } from '@mui/icons-material';

const FileInput = ({ id, label, onChange, required, example, onExampleClick, accept }) => (
  <Box mb={2}>
    <Typography variant="subtitle1" component="label" htmlFor={id}>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
      <Tooltip title={example}>
        <IconButton size="small">
          <Help fontSize="small" />
        </IconButton>
      </Tooltip>
      <Button onClick={onExampleClick} size="small" color="primary">
        See Example
      </Button>
    </Typography>
    <TextField
      type="file"
      id={id}
      fullWidth
      required={required}
      onChange={(e) => onChange(e.target.files[0])}
      InputProps={{
        inputProps: { accept: accept }
      }}
    />
  </Box>
);

export default FileInput;
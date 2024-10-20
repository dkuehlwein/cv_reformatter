import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, CircularProgress, Tooltip } from '@mui/material';
import { Close, Description, PictureAsPdf, Slideshow } from '@mui/icons-material';
import { Document, Page } from 'react-pdf';
import mammoth from 'mammoth';
import pptxgen from 'pptxgenjs';

const FilePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generatePreview = async () => {
      setLoading(true);
      setError(null);
      try {
        switch (file.type) {
          case 'application/pdf':
            setPreview(<Document file={file}><Page pageNumber={1} width={200} /></Document>);
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            const reader = new FileReader();
            reader.onloadend = async (e) => {
              const arrayBuffer = e.target.result;
              const result = await mammoth.convertToHtml({arrayBuffer});
              setPreview(<div dangerouslySetInnerHTML={{__html: result.value.substring(0, 500) + '...'}} />);
            };
            reader.readAsArrayBuffer(file);
            break;
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            const pptx = new pptxgen();
            await pptx.load(file);
            const slide = pptx.getSlide(0);
            const dataUrl = await slide.exportBase64();
            setPreview(<img src={`data:image/png;base64,${dataUrl}`} alt="First slide" style={{maxWidth: '200px'}} />);
            break;
          default:
            setError('Unsupported file type');
        }
      } catch (error) {
        console.error('Error generating preview:', error);
        setError('Error generating preview');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [file]);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <PictureAsPdf color="primary" />;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return <Slideshow color="primary" />;
      default:
        return <Description color="primary" />;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(file.type)}
          <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'medium' }}>
            {file.name}
          </Typography>
        </Box>
        <Tooltip title="Remove file">
          <IconButton
            onClick={onRemove}
            size="small"
            aria-label="remove file"
            sx={{
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          mt: 1,
          width: '100%',
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error.main">{error}</Typography>
        ) : (
          preview
        )}
      </Box>
    </Paper>
  );
};

export default FilePreview;
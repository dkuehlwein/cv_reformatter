import React, { useState, useCallback } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CloudUpload, FileCopy, Download } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import FileInput from './FileInput';
import FilePreview from './FilePreview';
import IntroContent from './IntroContent';
import ErrorBoundary from './ErrorBoundary';
import useFileUpload from '../hooks/useFileUpload';
import { reformatCV } from '../api/cvApi';
import exampleContent from '../data/exampleContent';

const FilePreviewSection = ({ files, removeFile }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>File Previews</Typography>
      <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', pr: 2 }}>
        {Object.entries(files).map(([key, file]) => (
          file && <FilePreview key={key} file={file} onRemove={() => removeFile(key)} />
        ))}
      </Box>
    </Box>
  );
};

const CVReformatter = () => {
  const [reformattedCV, setReformattedCV] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const { files, handleFileUpload, removeFile } = useFileUpload(setActiveStep, setSnackbar);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!files.cv || !files.template) {
      setError("Please select both CV and template files.");
      return;
    }

    setIsLoading(true);
    setError('');
    setActiveStep(3);

    try {
      const result = await reformatCV(files.cv, files.template, files.example);
      setReformattedCV(result);
      setActiveStep(4);
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred while reformatting the CV. Please try again.");
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(reformattedCV).then(() => {
      setSnackbar({ open: true, message: 'CV copied to clipboard!' });
    });
  }, [reformattedCV]);

  const downloadCV = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([reformattedCV], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "reformatted_cv.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbar({ open: true, message: 'CV downloaded successfully!' });
  }, [reformattedCV]);

  return (
    <ErrorBoundary>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ my: 4, fontWeight: 'bold', color: 'primary.main' }}>
          Professional CV Reformatter
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {['Upload CV', 'Upload Template', 'Upload Example (Optional)', 'Reformat'].map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <FileInput
                  id="cv"
                  label="Upload your CV"
                  onChange={(file) => handleFileUpload(file, 'cv')}
                  required
                  example="Upload your current CV in DOCX, PDF, or PPTX format."
                  onExampleClick={() => setOpenDialog('cv')}
                  accept=".docx,.pdf,.pptx"
                />
                <FileInput
                  id="template"
                  label="Upload Template"
                  onChange={(file) => handleFileUpload(file, 'template')}
                  required
                  example="Upload the template you want to use in DOCX, PDF, or PPTX format."
                  onExampleClick={() => setOpenDialog('template')}
                  accept=".docx,.pdf,.pptx"
                />
                <FileInput
                  id="example"
                  label="Upload Example (Optional)"
                  onChange={(file) => handleFileUpload(file, 'example')}
                  example="Upload an example of a completed CV using your chosen template in DOCX, PDF, or PPTX format."
                  onExampleClick={() => setOpenDialog('example')}
                  accept=".docx,.pdf,.pptx"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading || !files.cv || !files.template}
                  startIcon={<CloudUpload />}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? 'Processing...' : 'Reformat CV'}
                </Button>
              </form>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {reformattedCV ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Reformatted CV</Typography>
                    <Box>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton onClick={copyToClipboard} aria-label="copy to clipboard">
                          <FileCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download CV">
                        <IconButton onClick={downloadCV} aria-label="download cv">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <ReactMarkdown>{reformattedCV}</ReactMarkdown>
                  </Box>
                </>
              ) : (
                <>
                  <IntroContent />
                  {Object.keys(files).length > 0 && (
                    <FilePreviewSection files={files} removeFile={removeFile} />
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={!!openDialog} onClose={() => setOpenDialog('')}>
          <DialogTitle>Example {openDialog}</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              <Typography variant="subtitle1" gutterBottom>
                This is an example of a {openDialog === 'cv' ? 'CV' : openDialog === 'template' ? 'template' : 'completed CV using a template'}.
              </Typography>
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto', bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {exampleContent[openDialog]}
                </pre>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default CVReformatter;
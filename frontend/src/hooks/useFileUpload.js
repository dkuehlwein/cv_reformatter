import { useState, useCallback } from 'react';

const useFileUpload = (setActiveStep, setSnackbar) => {
  const [files, setFiles] = useState({ cv: null, template: null, example: null });

  const handleFileUpload = useCallback((file, type) => {
    setFiles(prevFiles => ({ ...prevFiles, [type]: file }));
    if (type === 'cv') {
      setActiveStep(prevStep => Math.max(prevStep, 1));
    } else if (type === 'template') {
      setActiveStep(prevStep => Math.max(prevStep, 2));
    }
    setSnackbar({ open: true, message: `${type.toUpperCase()} file uploaded successfully!` });
  }, [setActiveStep, setSnackbar]);

  const removeFile = useCallback((type) => {
    setFiles(prevFiles => ({ ...prevFiles, [type]: null }));
    if (type === 'cv' || type === 'template') {
      setActiveStep(prevStep => prevStep - 1);
    }
    setSnackbar({ open: true, message: `${type.toUpperCase()} file removed.` });
  }, [setActiveStep, setSnackbar]);

  return { files, handleFileUpload, removeFile };
};

export default useFileUpload;
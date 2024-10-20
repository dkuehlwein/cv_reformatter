export const reformatCV = async (cv, template, example) => {
  const formData = new FormData();
  formData.append('cv', cv);
  formData.append('template', template);
  if (example) formData.append('example', example);

  const response = await fetch('http://localhost:5000/api/reformat', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.reformattedCV;
};
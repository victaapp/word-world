import React, { useState } from 'react';

const FileReaderComponent = () => {
  const [fileContent, setFileContent] = useState([]);
  
  const handleFileChange = (event) => {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const wordsArray = createWordsArray(content);
        setFileContent(wordsArray);
        createJsFile(wordsArray);
      };

      reader.readAsText(file);
    } else {
      alert('Please select a file.');
    }
  };

  const createWordsArray = (content) => {
    // Implement your logic to process the content and create an array of words
    const words = content.split(/\s+/);
    return words.filter(word => word.trim() !== ''); // Remove empty strings
  };

  const createJsFile = (wordsArray) => {
    const jsFileContent = `const wordsArray = ${JSON.stringify(wordsArray)};`;

    // Create a Blob with the JavaScript content
    const blob = new Blob([jsFileContent], { type: 'application/javascript' });

    // Create a download link and trigger a click event
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wordsArray.js';
    link.click();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileReaderComponent;

export const downloadFile = ({ fileUrl, fileName }: { fileUrl: string; fileName: string }) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName; // Specify the file name for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
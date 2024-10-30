import { useState } from 'react';
import Card from 'components/card';

const PdfUploadWidget = ({ icon, themeColor }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px]">
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <div className="my-4">
          <label className="custom-file-upload">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
            Choose File
          </label>
          <div>
            {selectedFiles.map((file, index) => (
              <div key={index}>
                {file.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-file-upload {
          border: 2px solid ${themeColor};
          color: ${themeColor};
          border-radius: 10px;
          padding: 10px 20px;
          cursor: pointer;
          display: inline-block;
        }

        .custom-file-upload input[type="file"] {
          display: none;
        }
      `}</style>
    </Card>
  );
};

export default PdfUploadWidget;

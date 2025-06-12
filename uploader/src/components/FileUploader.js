import React, { useState, useCallback, useEffect } from "react";
import { DropZone, Thumbnail, BlockStack, Box } from "@shopify/polaris";
import { UploadIcon } from "@shopify/polaris-icons";
import axios from "axios";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: URL.createObjectURL(file),
      progress: 0,
      status: "queued",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const uploadFile = async (fileObj) => {
    setIsUploading(true);
    updateFileStatus(fileObj, { status: "uploading", progress: 0 });
    const formData = new FormData();
    formData.append("file", fileObj.file);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/upload`, formData, {
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          updateFileStatus(fileObj, { progress });
        },
      })
      .then(() =>
        updateFileStatus(fileObj, { status: "success", progress: 100 })
      )
      .catch((error) => {
        console.log(error);
        updateFileStatus(fileObj, { status: "error" });
      })
      .finally(setIsUploading(false));
  };

  useEffect(() => {
    if (!isUploading) {
      const next = files.find((f) => f.status === "queued");
      if (next) {
        uploadFile(next);
      }
    }
  }, [files, isUploading]);

  const updateFileStatus = (targetFile, updates) => {
    setFiles((prev) =>
      prev.map((f) => {
        return f.id === targetFile.id ? { ...f, ...updates } : f;
      })
    );
  };
  const retryUpload = (fileObj) => {
    updateFileStatus(fileObj, { status: "queued", progress: 0 });
  };
  return (
    <>
      <BlockStack spacing="loose">
        {files.map((fileObj) => {
          return (
            <BlockStack alignment="center" key={fileObj.id}>
              <Thumbnail
                source={
                  fileObj.file.name
                    ? window.URL.createObjectURL(fileObj.file)
                    : UploadIcon
                }
              />
              <Box style={{ marginBottom: "1em" }}>
                <strong>{fileObj.file.name}</strong> - {fileObj.status}
                <Box
                  style={{
                    width: "100%",
                    background: "#eee",
                    height: "6px",
                    marginTop: "4px",
                  }}
                >
                  <Box
                    style={{
                      width: `${fileObj.progress}%`,
                      height: "6px",
                      background:
                        fileObj.status === "success"
                          ? "green"
                          : fileObj.status === "error"
                          ? "red"
                          : "#007bff",
                      transition: "width 0.3s",
                    }}
                  />
                </Box>
              </Box>
              {fileObj.status === "error" && (
                <button onClick={() => retryUpload(fileObj)}>Retry</button>
              )}
            </BlockStack>
          );
        })}
      </BlockStack>
      <DropZone onDrop={handleDrop} allowMultiple variableHeight>
        <DropZone.FileUpload />
      </DropZone>
    </>
  );
};

export default FileUploader;

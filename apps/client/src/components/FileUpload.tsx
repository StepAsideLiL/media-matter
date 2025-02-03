"use client";

import Image from "next/image";
import { useState } from "react";

export default function FileUpload() {
  const [files, setFile] = useState<File[]>([]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const allFiles = event.target.files ? Array.from(event.target.files) : [];
    setFile(allFiles);
  }

  function handleRemoveFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    setFile(newFiles);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <label htmlFor="file-upload" className="text-gray-500 cursor-pointer">
        Upload File
      </label>
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange(event)
        }
      />

      {files.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          {files.map((file, index) => (
            <span key={index} className="relative text-xs flex flex-col gap-1">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                width={100}
                height={100}
              />
              <span>{file.name}</span>
              <button
                className="size-4 absolute top-0 right-0 bg-foreground text-background border border-foreground rounded-full"
                onClick={() => handleRemoveFile(index)}
              >
                X
              </button>
            </span>
          ))}
        </div>
      )}

      <button className="px-5 py-2 text-background bg-foreground hover:bg-gray-300 hover:text-gray-800 rounded-md">
        Upload
      </button>
    </div>
  );
}

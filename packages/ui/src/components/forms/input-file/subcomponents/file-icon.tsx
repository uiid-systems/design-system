import { File, CloudUpload, Paperclip, Upload, Image } from "lucide-react";
import "./file-icon.css";

export type FileIconProps = {
  type?: "file" | "cloud" | "attachment" | "upload" | "image";
};

const SIZE = 12;

export const FileIcon = ({ type = "file" }: FileIconProps) => {
  const getIcon = () => {
    if (type === "cloud") return <CloudUpload size={SIZE} />;
    if (type === "attachment") return <Paperclip size={SIZE} />;
    if (type === "upload") return <Upload size={SIZE} />;
    if (type === "image") return <Image size={SIZE} />;
    return <File size={SIZE} />;
  };

  return (
    <aside data-slot="file-icon" aria-hidden="true">
      {getIcon()}
    </aside>
  );
};
FileIcon.displayName = "FileIcon";

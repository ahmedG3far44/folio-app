import { UploadFileType } from "@/lib/types";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export interface UploadContextType {
  uploadedInfo: UploadFileType[] | null;
  setUploadedInfo: (uploaded: UploadFileType[]) => void;
}
const UploadContext = createContext<UploadContextType>({
  uploadedInfo: null,
  setUploadedInfo: () => {},
});
const UploadProvider: FC<PropsWithChildren> = ({ children }) => {
  const [uploadedInfo, setUploadedInfo] = useState<UploadFileType[] | null>(
    null
  );
  return (
    <UploadContext.Provider value={{ uploadedInfo, setUploadedInfo }}>
      {children}
    </UploadContext.Provider>
  );
};

export default UploadProvider;

export const useUpload = () => useContext(UploadContext);

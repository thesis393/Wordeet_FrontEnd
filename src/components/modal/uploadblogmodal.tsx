// EditProfileModal.tsx
import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Image,
  Textarea,
} from "@nextui-org/react";
import ReactImageUploading from "react-images-uploading";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import {
  createUser,
  updateUser,
  uploadDataIrys,
  uploadImageFile,
} from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { CameraIcon, CoinsIcon } from "lucide-react";
import { transferUSDC } from "@/utils/tokentransfer";
import { useWallet } from "@solana/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";

interface UploadBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  DesPubKey: string;
}

const UploadBlogModal: React.FC<UploadBlogModalProps> = ({
  isOpen,
  onClose,
  DesPubKey,
}) => {
  const [tip, setTip] = useState<any>("");
  const { userInfo } = useUserInfo();
  const { walletAddress } = useWalletAddress();
  const { onOpenChange } = useDisclosure();
  const [images, setImages] = useState<any>([]);
  const [title, setTitle] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow only numbers and ensure the value is greater than 0
    if (/^\d*$/.test(inputValue)) {
      const numericValue = parseInt(inputValue, 10);
      if (isNaN(numericValue) || numericValue > 0) {
        setTip(inputValue);
      }
    }
  };

  const handleImageUpload = async (
    file: File
  ): Promise<{ url?: string; message: string }> => {
    const response = await uploadImageFile(file);

    if (response.url) {
      toast.success(`Image uploaded successfully: ${response.url}`);
      console.log(`Image uploaded successfully: ${response.url}`);
      return {
        url: response.url,
        message: response.message,
      };
    } else {
      toast.error(`Upload failed: ${response.message}`);
      console.log(`Upload failed: ${response.message}`);
      return {
        message: response.message,
      };
    }
  };

  const publishBlog = () => {
    if (!images.length) {
      toast.error(`Select Image`);
      console.log("iamge", images.length);
      return false;
    }
    if (title.length) {
      toast.error(`Input title`);
      console.log(`title length: `, title.length);
      return false;
    }
    const result = handleImageUpload(images[0].file);
  };

  const { publicKey, signTransaction } = useWallet();
  const onTipSend = async () => {
    try {
      if (!publicKey || !signTransaction) {
        throw new Error("Wallet not connected.");
      }
      if (tip <= 0) {
        toast.error("Set tip amount");
        return;
      }
      console.log("publickey: ", publicKey);
      const result = await transferUSDC(
        DesPubKey,
        tip,
        walletAddress,
        signTransaction
      );
      toast.success(`signature, ${result}`);
      console.log("Tip sent successfully! ", result);
    } catch (error) {
      toast.error(`Error sending tip: ${error}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Publish</ModalHeader>
            <ModalBody>
              <ReactImageUploading
                multiple
                value={images}
                onChange={(imageList) => setImages(imageList)}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  // write your building UI
                  <div>
                    {imageList.length > 0 ? (
                      imageList.map((image, index) => (
                        <div key={index} className="">
                          <Image
                            className="object-cover"
                            height={200}
                            shadow="md"
                            alt="NextUI hero Image with delay"
                            src={image["data_url"]}
                            width="100%"
                            onClick={() => onImageUpdate(index)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          color="success"
                          endContent={<CameraIcon />}
                          onClick={onImageUpload}
                        >
                          Take a cover image
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </ReactImageUploading>
              <Textarea
                maxRows={3}
                label="Title"
                placeholder="Give it a title.."
              />
              <div className="flex justify-between px-1 py-2">
                <Checkbox
                  classNames={{
                    label: "text-small",
                  }}
                  defaultSelected
                >
                  Irys
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={publishBlog}>
                Publish
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <Toaster />
    </Modal>
  );
};

export default UploadBlogModal;

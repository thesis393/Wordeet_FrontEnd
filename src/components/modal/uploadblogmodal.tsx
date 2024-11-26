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

  const handleUpload = async () => {
    if (!images[0].file) {
      toast.error("No file selected!");
      return;
    }

    const response = await uploadImageFile(images[0].file);

    if (response.url) {
      toast.success(`Image uploaded successfully: ${response.url}`);
      console.log(`Image uploaded successfully: ${response.url}`);
    } else {
      toast.error(`Upload failed: ${response.message}`);
      console.log(`Upload failed: ${response.message}`);
    }
  };

  const publishBlog = () => {
    handleUpload();
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
                            // isBlurred
                            // color="default"
                          />
                        </div>
                      ))
                    ) : (
                      <div>
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
    </Modal>
  );
};

export default UploadBlogModal;

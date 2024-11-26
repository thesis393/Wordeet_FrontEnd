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
} from "@nextui-org/react";
import ReactImageUploading from "react-images-uploading";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import { createUser, updateUser } from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { CoinsIcon } from "lucide-react";
import { transferUSDC } from "@/utils/tokentransfer";
import { useWallet } from "@solana/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  DesPubKey: string;
}

const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose, DesPubKey }) => {
  const [tip, setTip] = useState<any>("");
  const { userInfo } = useUserInfo();
  const { walletAddress } = useWalletAddress();
  const { onOpenChange } = useDisclosure();

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

  const { publicKey, signTransaction } = useWallet();
  const onTipSend = async () => {
    try {
      // const recipientPublicKey = "7XB7bUyNF4VNYkZRCMsbZyWwKGWZHxWD5MSZsqLtBsHv";
      // const amount = 1; // 1 USDC

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
            <ModalHeader className="flex flex-col gap-1">Tip</ModalHeader>
            <ModalBody>
              <Input
                type="number"
                min={0}
                value={tip}
                onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onTipSend}>
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <Toaster />
    </Modal>
  );
};

export default TipModal;

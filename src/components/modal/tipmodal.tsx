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
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import ReactImageUploading from "react-images-uploading";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import { createUser, updateUser } from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { CoinsIcon } from "lucide-react";
import { transferUSDC } from "@/utils/tokentransfer";
import { useWallet } from "@solana/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";
import { SolanaQRCode } from "../qr-code";

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
  const apiPath = "/api/actions/donate-spl";

  const apiEndpoint =
    new URL(apiPath, window.location.href).toString() + `?to=${DesPubKey}`;
  console.log("aniEndpoint", apiEndpoint);

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
            <ModalHeader className="flex flex-row gap-1">
              Donate USDC to Creators
              <CoinsIcon />
            </ModalHeader>
            <ModalBody>
              <Input
                label="Price"
                type="number"
                min={0}
                value={tip}
                onChange={handleChange}
                placeholder="0.00"
                labelPlacement="outside"
                endContent={
                  <div className="flex items-center pointer-events-none">
                    <span className="text-default-400 text-small">
                      <CoinsIcon />
                    </span>
                  </div>
                }
              />

              <Card className="flex justify-center items-center group-hover:border-primary mx-auto rounded w-min text-center overflow-hidden size-[400px]">
                <SolanaQRCode
                  url={`${apiPath}?validator=${DesPubKey}`}
                  color="white"
                  background="black"
                  size={400}
                  className="rounded-lg min-w-[400px] overflow-clip"
                />
              </Card>
              <Card className="group-hover:border-primary">
                <CardHeader>Action Endpoint</CardHeader>
                <CardBody className="space-y-2">
                  <p className="text-muted-foreground">
                    <Link
                      href={apiEndpoint}
                      target="_blank"
                      className="hover:text-primary underline line-break-anywhere"
                    >
                      {apiEndpoint}
                    </Link>
                  </p>
                </CardBody>
              </Card>
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

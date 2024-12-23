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
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import ReactImageUploading from "react-images-uploading";
import {
  createUser,
  postBlog,
  signVerify,
  updateUser,
  uploadDataIrys,
  uploadImageFile,
} from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import { CameraIcon, CoinsIcon } from "lucide-react";
import { transferUSDC } from "@/utils/tokentransfer";
import { useWallet } from "@solana/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";
import crypto from "crypto";
import { version } from "os";
import bs58 from "bs58";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import useProgram from "@/app/anchor/config";
import { PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";

interface UploadBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  contents: string;
  keywords: string;
  walletAddress: string | null | undefined;
}

const UploadBlogModal: React.FC<UploadBlogModalProps> = ({
  isOpen,
  onClose,
  contents,
  keywords,
  walletAddress,
}) => {
  const [tip, setTip] = useState<any>("");
  const { userInfo } = useUserInfo();
  const { onOpenChange } = useDisclosure();
  const [images, setImages] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("de-fi");
  const [isSelected, setIsSelected] = React.useState(true);
  const wallet = useWallet();
  const program = useProgram();
  const [transactionPending, setTransactionPending] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = e.target.value;
  //   // Allow only numbers and ensure the value is greater than 0
  //   if (/^\d*$/.test(inputValue)) {
  //     const numericValue = parseInt(inputValue, 10);
  //     if (isNaN(numericValue) || numericValue > 0) {
  //       setTip(inputValue);
  //     }
  //   }
  // };

  const handleImageUpload = async (
    file: File
  ): Promise<{ url: string; message: string }> => {
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
        url: ``,
        message: response.message,
      };
    }
  };

  const signMessage = async (digest: string) => {
    if (wallet && wallet.signMessage) {
      const publicKey = wallet.publicKey?.toBase58();
      const message = `I authorize publishing on Devnet using the key: ${publicKey} Digest: ${digest}`;

      const encodedMessage = new TextEncoder().encode(message);
      const signature = await wallet.signMessage(encodedMessage);
      const serializedSignature = bs58.encode(signature);

      console.log("Encoded Message:", encodedMessage);
      console.log("Signature:", signature);

      const signingKey = {
        kty: "EC",
        crv: "P-256",
        x: wallet.publicKey?.toBase58(),
        ext: true,
      };
      return {
        contributor: publicKey,
        signature: serializedSignature,
        signingKeyMessage: message,
        signingKey: signingKey,
      };
    }
  };

  const postBlogByContract = async (
    coverimage: string,
    title: string,
    content: string,
    catecory: string,
    keywords: string,
    walletAddress: string
  ) => {
    console.log("getUserProfileById start", program, walletAddress);

    if (walletAddress && program) {
      try {
        setTransactionPending(true);
        const tempPubKey = new PublicKey(walletAddress);
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), tempPubKey.toBuffer()],
          program.programId
        );

        console.log("USER PDA = " + userPda);
        const userProfile = await program.account.userProfile.fetch(userPda);
        console.log("USER Post Count = " + userProfile.postCount);

        const [postPda] = findProgramAddressSync(
          [
            utf8.encode("post"),
            tempPubKey.toBuffer(),
            Uint8Array.from([userProfile.postCount]),
          ],
          program.programId
        );
        console.log("POST PDA= " + postPda);

        await program.methods
          .createBlogPost(
            coverimage,
            title,
            content,
            catecory,
            keywords,
            walletAddress
          )
          .accounts({
            blogPost: postPda,
            owner: tempPubKey,
            userProfile: userPda,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        setTransactionPending(false);
        console.log("Successfully Posted Blog");
        return true;
      } catch (error) {
        setTransactionPending(false);
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
  };

  const publishBlog = async () => {
    if (!walletAddress) {
      toast.error("Wallet address is not connected");
      return;
    }

    console.log("image", images.length);
    if (!images.length) {
      toast.error(`Select Image`);
      return false;
    }

    console.log(`title length: `, title.length, `title`, title);
    if (title.length == 0) {
      toast.error(`Input title`);
      return false;
    }

    //Coverimage upload Part
    const coverimage = await handleImageUpload(images[0].file);
    if (coverimage.url == ``) {
      toast.error(`Upload CoverImage faild:  ${coverimage.message}`);
      return;
    }

    try {
      //Make Irys data.
      const timestamp = Math.floor(Date.now() / 1000);
      console.log("Current Timestamp:", timestamp);
      const content = {
        body: contents,
        timestamp: timestamp,
        title: title,
      };

      console.log("contents", content);

      const digest = crypto
        .createHash("sha256")
        .update(JSON.stringify(content))
        .digest("hex");
      console.log("Digest:", digest);

      const resultSignMsg = await signMessage(digest);

      const resultVerify = await signVerify(resultSignMsg);

      if (!resultVerify) {
        toast.error("Verify failed");
        return;
      }

      const authorship = {
        contributor: resultSignMsg?.contributor,
        signingKeyMessage: resultSignMsg?.signingKeyMessage,
        signature: resultSignMsg?.signature,
        algorithm: {
          name: "ECDSA",
          hash: "SHA-256",
        },
        signingKey: resultSignMsg?.signingKey,
      };
      console.log("authorship", authorship);

      const blogData = {
        content: content,
        authorship: authorship,
        version: "MVP-1",
      };

      let nStatus = 1;
      if (isSelected) nStatus = 2;

      try {
        const uploadResult = await uploadDataIrys(
          coverimage.url,
          title,
          contents,
          keywords,
          walletAddress,
          nStatus,
          false,
          blogData
        );
        console.log(uploadResult.message, uploadResult.url);
        console.log("Blog upload Irys successfully", uploadResult);

        if (uploadResult.url == `` || !uploadResult.url) {
          toast.error(`Upload CoverImage faild:  ${uploadResult.message}`);
          return false;
        }
        //Smart Contract Way
        const result = postBlogByContract(
          coverimage.url,
          title,
          uploadResult.url,
          category,
          keywords,
          walletAddress
        );

        //Backend Way
        // const result = postBlog(
        //   coverimage.url,
        //   title,
        //   contents,
        //   keywords,
        //   walletAddress,
        //   nStatus,
        //   false
        // );

        console.log("Blog posted successfully", result);
      } catch (error) {
        console.error("Error postin blog", error);
      }
    } catch (error) {
      console.error("Error postin blog", error);
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
                value={title}
                onValueChange={setTitle}
              />
              <div className="flex justify-between px-1 py-2">
                {/* <Checkbox
                  classNames={{
                    label: "text-small",
                  }}
                  defaultSelected
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                >
                  Irys
                </Checkbox> */}

                <RadioGroup
                  label="Select the category"
                  orientation="horizontal"
                  size="md"
                  defaultValue={category}
                  onValueChange={setCategory}
                >
                  <Radio value="de-fi">DeFi</Radio>
                  <Radio value="de-pin">DePin</Radio>
                  <Radio value="de-sci">DeSci</Radio>
                  <Radio value="dao">DAO</Radio>
                  <Radio value="nft">NFT</Radio>
                </RadioGroup>
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

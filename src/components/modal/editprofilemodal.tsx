// EditProfileModal.tsx
import React, { useEffect, useState } from "react";

import {
  Modal,
  Button,
  Input,
  Textarea,
  Avatar,
  ModalContent,
  Card,
  user,
} from "@nextui-org/react";
import ReactImageUploading from "react-images-uploading";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import { createUser, updateUser, uploadImageFile } from "@/app/api";
import { useUserInfo } from "@/provider/UserInfoProvider";
import toast, { Toaster } from "react-hot-toast";
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Border {
  border:
    | "success"
    | "default"
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | undefined;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userInfo } = useUserInfo();

  const [name, setName] = useState(`${userInfo?.username}`);
  const [bio, setBio] = useState(`${userInfo?.bio}`);
  const [externalLink, setExternalLink] = useState(`${userInfo?.externallink}`);

  const [border, setBorder] = useState<Border>({ border: "success" });

  const [images, setImages] = useState<any>([]);

  const { walletAddress } = useWalletAddress();

  const onChangeImage = (imageList: any, addUpdateIndex: number) => {
    setImages(imageList);
  };

  const handleAuthorize = () => {
    // Add the authorization logic here
    console.log("Authorize on Twitter");
  };

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

  const saveProfile = async () => {
    if (!walletAddress) {
      console.error("Wallet address is not connected");
      return;
    }

    let avatarUrl = "";
    console.log("image", images.length);

    if (!images.length) {
      // toast.error(`Select Image`);
      if (userInfo?.avatar.length > 0) avatarUrl = `${userInfo?.avatar}`;
    } else {
      const avatar = await handleImageUpload(images[0].file);
      avatarUrl = avatar.url;
    }

    if (`${userInfo?._id}` == "undefined") {
      try {
        const result = createUser(
          avatarUrl,
          name,
          walletAddress,
          "http://x.com//bresin",
          externalLink,
          bio
        );
        console.log("User created successfully", result);
      } catch (error) {
        console.error("Error create User", error);
      }
    } else {
      try {
        const result = updateUser(
          avatarUrl,
          name,
          walletAddress,
          "http://x.com//bresin",
          externalLink,
          bio
        );
        console.log("User updated successfully", result);
      } catch (error) {
        console.error("Error updated User", error);
      }
    }
    onClose();
    return;
  };

  useEffect(() => {
    console.log("EditProfileModal start", userInfo);
    setName(`${userInfo?.username}`);
    setBio(`${userInfo?.bio}`);
    setExternalLink(`${userInfo?.externallink}`);
    setBorder({ border: "success" });
  }, [userInfo]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <div className="p-6">
              <h2 className="mb-4 font-semibold text-2xl text-center">
                Edit Profile
              </h2>
              <div className="flex flex-col items-center mb-4">
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
                          <div key={index}>
                            <Avatar
                              isBordered
                              src={image["data_url"]}
                              alt=""
                              size="lg"
                              color={border.border}
                              className="mb-4 w-36 h-36"
                              onClick={() => onImageUpdate(index)}
                            />
                          </div>
                        ))
                      ) : (
                        <Avatar
                          isBordered
                          src={`${userInfo?.avatar}`} // Replace with your image path
                          alt="Profile Image"
                          size="lg"
                          className="mb-4 w-36 h-36"
                          onClick={onImageUpload}
                          color={border.border}
                        />
                      )}
                    </div>
                  )}
                </ReactImageUploading>
                <p className="text-gray-500">
                  {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                </p>
                <Button size="sm" className="my-2">
                  Subscribe
                </Button>
              </div>

              <div className="flex justify-center space-x-2 my-3">
                {/* Color picker buttons */}
                <button
                  onClick={() => setBorder({ border: "default" })}
                  className="bg-default rounded-full w-6 h-6"
                />
                <button
                  onClick={() => setBorder({ border: "primary" })}
                  className="bg-primary rounded-full w-6 h-6"
                />
                <button
                  onClick={() => setBorder({ border: "secondary" })}
                  className="bg-secondary rounded-full w-6 h-6"
                />
                <button
                  onClick={() => setBorder({ border: "danger" })}
                  className="bg-danger rounded-full w-6 h-6"
                />
                <button
                  onClick={() => setBorder({ border: "warning" })}
                  className="bg-warning rounded-full w-6 h-6"
                />
                <button
                  onClick={() => setBorder({ border: "success" })}
                  className="bg-success rounded-full w-6 h-6"
                />
                {/* Add more colors as needed */}
              </div>

              <Input
                label="Name"
                placeholder="What do you want to be known as?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                className="mb-4"
              />
              <Textarea
                label="Bio"
                placeholder="A brief summary of who you are."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Input
                label="External Link"
                placeholder="Add an external link to your profile."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                fullWidth
                className="mb-4"
              />

              <div className="bg-default-100 shadow-md mx-auto p-4 rounded-lg max-w-md">
                <h4 className="mb-1 text-gray-500 text-medium">Twitter</h4>
                <p className="mb-4 text-gray-400 text-sm">
                  Link your Twitter account
                </p>

                <Card className="flex flex-row justify-between items-center bg-gray-300 p-2 rounded-lg">
                  <span className="text-gray-500">
                    No Twitter account linked
                  </span>
                  <Button
                    onClick={handleAuthorize}
                    className="bg-gray-500 hover:bg-gray-700 text-white"
                    size="sm"
                  >
                    Authorize on Twitter
                  </Button>
                </Card>
              </div>
              <Button
                onClick={() => saveProfile()}
                className="bg-black mt-3 w-full text-white"
              >
                Save Settings
              </Button>
            </div>
          </>
        )}
      </ModalContent>
      <Toaster />
    </Modal>
  );
};

export default EditProfileModal;

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Layout from "@/components/layout";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Tiptap from "@/components/tiptap/tiptap";
import { useEffect, useState } from "react";
import { Avatar, Button, Image, Input } from "@nextui-org/react";
import { postBlog, uploadDataIrys } from "@/app/api";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import ReactImageUploading from "react-images-uploading";
import { CameraIcon, PrinterIcon, SaveIcon } from "lucide-react";
import WriteLayout from "@/components/layout/writelayout";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverimage, setImage] = useState("dfjdkfjdkjf");
  const [keywords, setKeyWords] = useState("");
  const [images, setImages] = useState<any>([]);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  const { walletAddress } = useWalletAddress();

  const uploadImage = async () => {
    const data = images.length > 0 ? images[0].file : null;
    const imgData = new FormData();
    imgData.append("file", data);
    console.log("result", data);

    const imgRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
        },
        body: imgData,
      }
    );

    const imgJsonData = await imgRes.json();
    console.log("result", imgJsonData);
    return imgJsonData.IpfsHash;
  };

  const handlePost = async (nStatus: number) => {
    if (!walletAddress) {
      console.log("Wallet address is not connected");
      return;
    }
    if (nStatus) {
      const data = images.length > 0 ? images[0].file : null;
      const imgData = new FormData();
      imgData.append("file", data);
      console.log("handlePost result", data);
      const uploadResult = await uploadDataIrys(
        data,
        title,
        content,
        keywords,
        walletAddress,
        nStatus,
        false
      );
      console.log(uploadResult.message, uploadResult.url);
    }
    try {
      const coverimage = await uploadImage();
      const result = postBlog(
        coverimage,
        title,
        content,
        keywords,
        walletAddress,
        nStatus,
        false
      );
      console.log("Blog posted successfully", result);
    } catch (error) {
      console.error("Error postin blog", error);
    }
  };

  useEffect(() => {
    console.log("content", content);
    console.log("title", title);
    console.log("walletAddress", walletAddress);
  }, [content, title, walletAddress]);

  return (
    <WriteLayout>
      <div className="flex flex-col flex-1 justify-between shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-auto px-4 py-8 rounded-b-lg container">
        {/* <ReactImageUploading
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
        </ReactImageUploading> */}

        {/* <div className="mt-12">
          <Input
            value={title}
            onValueChange={setTitle}
            title="Blog Title"
            placeholder="Blog Title"
            label=""
            size="lg"
          />
        </div> */}
        <div className="flex-1 mt-12">
          <Tiptap content={content} onChange={handleContentChange} />
        </div>
        <div className="mt-12">
          <div className="flex flex-raw justify-center gap-9">
            <Button
              color="success"
              variant="bordered"
              startContent={<SaveIcon />}
              onClick={() => handlePost(0)}
            >
              Save Article
            </Button>
            <Button
              color="primary"
              variant="bordered"
              startContent={<PrinterIcon />}
              onClick={() => handlePost(1)}
            >
              Publish Article
            </Button>
          </div>
        </div>
      </div>
    </WriteLayout>
  );
}

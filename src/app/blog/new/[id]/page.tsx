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
import { Article_, getBlog, postBlog, updateBlog } from "@/app/api";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import ReactImageUploading from "react-images-uploading";
import { CameraIcon, PrinterIcon, SaveIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverimage, setCoverImage] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [images, setImages] = useState<any>([]);
  const [blog, setBlog] = useState<Article_>();
  const [id, setId] = useState("");

  const { draftBlogInfo } = useDraftBlogInfo();

  const params = useParams();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const id = params.id;
  //     if (id !== undefined) {
  //       try {
  //         const result = await getBlog(id);
  //         if (result) {
  //           setBlog(result as Article_);
  //           console.log("User get blog", result);
  //           setTitle(result?.blog?.title);
  //           setContent(result?.blog?.content);
  //           setCoverImage(result?.blog?.coverimage);
  //           console.log("content 1", content);
  //         }
  //       } catch (error) {
  //         console.error("Error get blog", error);
  //       }
  //     }
  //   };
  //   if (params) {
  //     fetchData();
  //     console.log("start 1");
  //   }
  // }, [params]);

  useEffect(() => {
    setTitle(draftBlogInfo?.title);
    setContent(draftBlogInfo?.content);
    setCoverImage(draftBlogInfo?.coverimage);
    setId(draftBlogInfo?._id);
    console.log("start 1", content);
    console.log("start 2", draftBlogInfo?.content);
  }, []);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    console.log("changed contect", newContent);
  };

  const { walletAddress } = useWalletAddress();

  const uploadImage = async () => {
    const data = images.length > 0 ? images[0].file : null;
    const imgData = new FormData();
    if (data != null) {
      imgData.append("file", data);
      console.log("img result", data);

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
    } else return coverimage;
  };

  const handlePost = async (nStatus: Number) => {
    if (!walletAddress) {
      console.log("Wallet address is not connected");
      return;
    }
    try {
      const coverimage = await uploadImage();
      const result = updateBlog(
        id,
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
    console.log("content 2", content);
    console.log("title", title);
    console.log("walletAddress", walletAddress);
  }, [content, title, walletAddress]);

  return (
    <Layout>
      <div className="flex-1 shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] mx-auto px-4 py-8 rounded-b-lg container">
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
              ) : coverimage === "" ? (
                <div>
                  <Button
                    color="success"
                    endContent={<CameraIcon />}
                    onClick={onImageUpload}
                  >
                    Take a cover image
                  </Button>
                </div>
              ) : (
                <div key={0} className="">
                  <Image
                    className="object-cover"
                    height={200}
                    shadow="md"
                    alt="NextUI hero Image with delay"
                    src={`https://ipfs.io/ipfs/${coverimage}`}
                    width="100%"
                    onClick={() => onImageUpdate(0)}
                  />
                </div>
              )}
            </div>
          )}
        </ReactImageUploading>
        <div className="mt-12">
          <Input
            value={title}
            onValueChange={setTitle}
            title="Blog Title"
            placeholder="Blog Title"
            label=""
            size="lg"
          />
        </div>
        <div className="mt-12">
          <Tiptap
            content={draftBlogInfo?.content}
            onChange={handleContentChange}
          />
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
    </Layout>
  );
}

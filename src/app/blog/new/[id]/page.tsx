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
import {
  Article_,
  getBlog,
  postBlog,
  updateBlog,
  uploadImageFile,
} from "@/app/api";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import ReactImageUploading from "react-images-uploading";
import { CameraIcon, PrinterIcon, SaveIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useDraftBlogInfo } from "@/provider/DraftBlogProvider";

import WriteLayout from "@/components/layout/writelayout";
import UploadBlogModal from "@/components/modal/uploadblogmodal";
import toast, { Toaster } from "react-hot-toast";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverimage, setCoverImage] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [images, setImages] = useState<any>([]);
  const [blog, setBlog] = useState<Article_>();
  const [id, setId] = useState("");
  const [isUploadBlogModalOpen, setIsUploadBlogModalOpen] = useState(false);

  const { draftBlogInfo } = useDraftBlogInfo();

  const params = useParams();

  useEffect(() => {
    setTitle(draftBlogInfo?.title);
    setContent(draftBlogInfo?.content);
    setCoverImage(draftBlogInfo?.coverimage);
    setId(draftBlogInfo?._id);
    console.log("start 1", content);
    console.log("start 2", draftBlogInfo?.content);
  }, []);

  const closeUploadBlogModal = () => {
    console.log("closeUploadBlogModal");
    setIsUploadBlogModalOpen(false);
  };

  const openUploadBlogModal = () => {
    console.log("openUploadBlogModal start");
    setIsUploadBlogModalOpen(true);
  };

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    console.log("changed contect", newContent);
  };

  const { walletAddress } = useWalletAddress();

  const saveBlog = async () => {
    if (!walletAddress) {
      console.log("Wallet address is not connected");
      return;
    }
    try {
      const coverimage = "";
      const nStatus = 0;
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
      console.log("Blog saved successfully", result);
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
    <WriteLayout>
      <div className="flex flex-col flex-1 justify-between shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] rounded-b-lg">
        <div className="flex-1">
          <Tiptap
            content={draftBlogInfo?.content}
            onChange={handleContentChange}
          />
        </div>
        <div className="bottom-5 sticky">
          <div className="flex flex-raw justify-center gap-9">
            <Button
              color="success"
              variant="bordered"
              startContent={<SaveIcon />}
              onClick={() => saveBlog()}
            >
              Save Article
            </Button>
            <Button
              color="primary"
              variant="bordered"
              startContent={<PrinterIcon />}
              onClick={() => openUploadBlogModal()}
            >
              Publish Article
            </Button>
          </div>
        </div>
      </div>
      <UploadBlogModal
        isOpen={isUploadBlogModalOpen}
        onClose={closeUploadBlogModal}
        contents={content}
        keywords={keywords}
        walletAddress={walletAddress}
      />
      <Toaster />
    </WriteLayout>
  );
}

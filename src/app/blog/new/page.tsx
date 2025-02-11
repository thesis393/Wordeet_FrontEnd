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
import { postBlog, uploadImageFile } from "@/app/api";
import { useWalletAddress } from "@/provider/AppWalletProvider";
import ReactImageUploading from "react-images-uploading";
import { CameraIcon, PrinterIcon, SaveIcon } from "lucide-react";
import WriteLayout from "@/components/layout/writelayout";
import UploadBlogModal from "@/components/modal/uploadblogmodal";
import toast, { Toaster } from "react-hot-toast";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [isUploadBlogModalOpen, setIsUploadBlogModalOpen] = useState(false);

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

      const result = postBlog(
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
    // console.log("content", content);
    // console.log("title", title);
    // console.log("walletAddress", walletAddress);
  }, [content, title, walletAddress]);

  return (
    <WriteLayout>
      <div className="flex flex-col flex-1 justify-between shadow-[4px_2px_12px_0_rgba(0,0,0,0.1)] rounded-b-lg">
        <div className="flex-1">
          <Tiptap content={content} onChange={handleContentChange} />
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

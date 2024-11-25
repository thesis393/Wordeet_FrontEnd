import Layout from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Wordit Settings page.",
};

export default function Settings() {
  return (
    <Layout>
      <div className="mt-12">Settings page</div>
    </Layout>
  );
}

import Layout from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordeets",
  description: "Wordit Wordeets page.",
};

export default function Wordeets() {
  return (
    <Layout>
      <div className="mt-12">Wordeets page</div>
    </Layout>
  );
}

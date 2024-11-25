import Layout from "@/components/layout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Blog List',
  description:
    'Wordit BlogList page.',
};


export default function BlogList() {
  return (
    <Layout>
      <div className="mt-12">
        Larn more page
      </div>
    </Layout>
  );
}

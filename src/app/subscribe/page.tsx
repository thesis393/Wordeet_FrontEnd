import Layout from "@/components/layout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Subscribe',
  description:
    'Wordit Subscribe page.',
};

export default function Subscribe() {
  return (
    <Layout>
      <div className="mt-12">
        Subscribe page
      </div>
    </Layout>
  );
}

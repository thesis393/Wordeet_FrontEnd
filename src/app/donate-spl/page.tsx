"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolanaQRCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "../config/site";
import Layout from "@/components/layout";

export default function Pages() {
  const apiPath = "/api/actions/donate-spl";
  const [apiEndpoint, setApiEndpoint] = useState("");

  useEffect(() => {
    setApiEndpoint(new URL(apiPath, window.location.href).toString());

    return () => {
      setApiEndpoint(new URL(apiPath, window.location.href).toString());
    };
  }, []);

  return (
    <Layout>
      <section
        id="action"
        className={
          "container space-y-12 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        }
      >
        <div className="flex flex-col items-center space-y-6 mx-auto max-w-[58rem] text-center">
          <h2 className="font-heading text-3xl sm:text-3xl md:text-6xl leading-[1.1]">
            Transfer USDC
          </h2>
        </div>

        <Card className="flex justify-center items-center group-hover:border-primary mx-auto rounded w-min text-center overflow-hidden size-[400px]">
          <SolanaQRCode
            url={apiPath}
            color="white"
            background="black"
            size={400}
            className="rounded-lg min-w-[400px] overflow-clip"
          />
        </Card>

        <Card className="group-hover:border-primary">
          <CardHeader>
            <CardTitle className="space-y-3">Action Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              <Link
                href={apiEndpoint}
                target="_blank"
                className="hover:text-primary underline"
              >
                {apiEndpoint}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}

"use client";

import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { button as buttonStyles } from "@heroui/theme";
import Pushmatic from "pushmatic";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@heroui/spinner";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  const [isLoading, setLoading] = useState(false);

  function handleSubscribe() {
    Pushmatic.initializePushNotifications("/sw.js", {
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })
      .then((subscription) => {
        sendSubscriptionToBackEnd(subscription);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  async function sendSubscriptionToBackEnd(subscription: PushSubscription) {
    setLoading(true);

    return fetch("/api/test-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad status code from server.");
        }

        return response.json();
      })
      .then((responseData) => {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error("Bad response from server.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xxl text-center justify-center">
        <span className={title()}>Add push notifications&nbsp;</span>
        <span className={title({ color: "violet" })}>easily&nbsp;</span>
        <br />
        <span className={title()}>to your website.</span>
        <div className={subtitle({ class: "mt-4" })}>
          A lightweight, framework-agnostic library for handling web push
          notifications easily.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          style={{ minWidth: 170 }}
          onPress={handleSubscribe}
        >
          {isLoading ? (
            <Spinner color="white" size="sm" />
          ) : (
            "Try Pushmatic Here"
          )}
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Snippet hideSymbol>npm install pushmatic</Snippet>
      </div>
    </section>
  );
}

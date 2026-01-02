"use client";

import { useEffect, useRef } from "react";
import { LoginOptions, triggerLogin } from "@/utils";
import { useLogin } from "@/components/providers/LoginProvider";

const SESSION_KEY = "synctrip_soft_login_shown";

export default function SoftLoginTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timerStartedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useLogin();

  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timerStartedRef.current) {
          timerStartedRef.current = true;

          timeoutRef.current = setTimeout(() => {
            sessionStorage.setItem(SESSION_KEY, "true");

            const options: LoginOptions = {
              headingText: "Login to Start Planning Your Trip",
            };

            triggerLogin(() => {}, options);
          }, 6000); // ⏱️ 6 seconds
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user]);

  return <div ref={ref}>{children}</div>;
}

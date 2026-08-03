"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function MobileNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        event.currentTarget.closest("details")?.removeAttribute("open");
      }}
    >
      {children}
    </Link>
  );
}

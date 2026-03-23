import type { NextConfig } from "next";
import nextPwa from "next-pwa";

function parseList(value?: string) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function normalizeHost(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (trimmedValue.includes("*")) {
    return trimmedValue.toLowerCase();
  }

  try {
    return new URL(trimmedValue).host.toLowerCase();
  } catch {
    return trimmedValue
      .replace(/^[a-z]+:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase();
  }
}

const codespacesDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
const inferredCodespacesHost = codespacesDomain ? `*.${codespacesDomain}` : null;
const localDevelopmentHosts = [
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
];

const sharedAllowedHosts = Array.from(
  new Set(
    [
      ...localDevelopmentHosts,
      ...parseList(process.env.NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS),
      process.env.AUTH_URL,
      process.env.NEXTAUTH_URL,
      inferredCodespacesHost,
    ]
      .map((value) => (value ? normalizeHost(value) : null))
      .filter((value): value is string => Boolean(value)),
  ),
);

const allowedDevOrigins = Array.from(
  new Set([
    ...sharedAllowedHosts,
    ...parseList(process.env.NEXT_ALLOWED_DEV_ORIGINS)
      .map((value) => normalizeHost(value))
      .filter((value): value is string => Boolean(value)),
  ]),
);

const withPWA = nextPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  allowedDevOrigins,
  experimental: {
    authInterrupts: true,
    serverActions: {
      allowedOrigins: sharedAllowedHosts,
    },
  },
};

export default withPWA(nextConfig);

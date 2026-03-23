import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Miso Phone DB",
    short_name: "Miso DB",
    description: "Mantenedor de contactos con autenticacion, historial y soporte PWA.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#0f766e",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

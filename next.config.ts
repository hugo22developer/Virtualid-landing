import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Indica a Next.js que genere archivos estáticos (HTML/CSS/JS)
  images: {
    unoptimized: true, // Necesario para que las imágenes funcionen en exportación estática
  },
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

export default nextConfig;
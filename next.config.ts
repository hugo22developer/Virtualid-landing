import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Esto es vital para que las imágenes funcionen en el despliegue estático
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/', destination: '/es', permanent: true },

      // URLs antiguas con slug local -> nueva estructura carpeta/ciudad
      { source: '/es/servicios/abogados-accidentes-trafico-:ciudad', destination: '/es/servicios/accidentes-trafico/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-familia-:ciudad', destination: '/es/servicios/derecho-familia/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-negligencias-medicas-:ciudad', destination: '/es/servicios/negligencias-medicas/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-extranjeria-:ciudad', destination: '/es/servicios/permisos-residencia/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-administrativo-:ciudad', destination: '/es/servicios/responsabilidad-administracion/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-responsabilidad-civil-:ciudad', destination: '/es/servicios/responsabilidad-civil/:ciudad', permanent: true },

      // URLs antiguas /es/abogados/ -> nueva estructura
      { source: '/es/abogados/abogados-accidentes-trafico-:ciudad', destination: '/es/servicios/accidentes-trafico/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-familia-:ciudad', destination: '/es/servicios/derecho-familia/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-negligencias-medicas-:ciudad', destination: '/es/servicios/negligencias-medicas/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-extranjeria-:ciudad', destination: '/es/servicios/permisos-residencia/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-administrativo-:ciudad', destination: '/es/servicios/responsabilidad-administracion/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-responsabilidad-civil-:ciudad', destination: '/es/servicios/responsabilidad-civil/:ciudad', permanent: true },

      // Redirecciones genéricas antiguas (slug dinámico) -> carpeta fija
      { source: '/es/servicios/extranjeria', destination: '/es/servicios/permisos-residencia', permanent: true },
      { source: '/es/servicios/derecho-administrativo', destination: '/es/servicios/responsabilidad-administracion', permanent: true },
    ];
  },
};

module.exports = nextConfig;

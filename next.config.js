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

      // EN: old /en/services/[slugEn] -> new folder structure
      { source: '/en/services/traffic-accident-lawyers-murcia', destination: '/en/services/traffic-accidents', permanent: true },
      { source: '/en/services/family-law-lawyers-murcia', destination: '/en/services/family-law', permanent: true },
      { source: '/en/services/medical-malpractice-lawyers-murcia', destination: '/en/services/medical-malpractice', permanent: true },
      { source: '/en/services/immigration-lawyers-murcia', destination: '/en/services/immigration', permanent: true },
      { source: '/en/services/administrative-law-lawyers-murcia', destination: '/en/services/administrative-law', permanent: true },
      { source: '/en/services/civil-liability-insurance-lawyers-murcia', destination: '/en/services/civil-liability', permanent: true },

      // EN: old /en/lawyers/[slugEn] -> new folder structure
      { source: '/en/lawyers/traffic-accident-lawyers-:city', destination: '/en/services/traffic-accidents/:city', permanent: true },
      { source: '/en/lawyers/family-law-lawyers-:city', destination: '/en/services/family-law/:city', permanent: true },
      { source: '/en/lawyers/medical-malpractice-lawyers-:city', destination: '/en/services/medical-malpractice/:city', permanent: true },
      { source: '/en/lawyers/immigration-lawyers-:city', destination: '/en/services/immigration/:city', permanent: true },
      { source: '/en/lawyers/administrative-law-lawyers-:city', destination: '/en/services/administrative-law/:city', permanent: true },
      { source: '/en/lawyers/civil-liability-insurance-lawyers-:city', destination: '/en/services/civil-liability/:city', permanent: true },

      // EN: old inactive services -> services listing
      { source: '/en/services/banking-law-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/criminal-law-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/real-estate-law-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/inheritance-law-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/commercial-law-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/contracts-obligations-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/mediation-lawyers-murcia', destination: '/en/services', permanent: true },
      { source: '/en/services/vulture-fund-defense-lawyers-murcia', destination: '/en/services', permanent: true },
    ];
  },
};

module.exports = nextConfig;

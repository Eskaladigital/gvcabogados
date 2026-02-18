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
      {
        source: '/',
        destination: '/es',
        permanent: true,
      },
      // Redirecciones 301: URLs antiguas /es/servicios/abogados-{servicio}-{ciudad}
      // -> nuevas /es/servicios/{servicio}/{ciudad}
      { source: '/es/servicios/abogados-accidentes-trafico-:ciudad', destination: '/es/servicios/accidentes-trafico/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-familia-:ciudad', destination: '/es/servicios/derecho-familia/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-bancario-:ciudad', destination: '/es/servicios/derecho-bancario/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-penal-:ciudad', destination: '/es/servicios/derecho-penal/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-inmobiliario-:ciudad', destination: '/es/servicios/derecho-inmobiliario/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-sucesorio-:ciudad', destination: '/es/servicios/derecho-sucesorio/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-mercantil-:ciudad', destination: '/es/servicios/derecho-mercantil/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-responsabilidad-civil-:ciudad', destination: '/es/servicios/responsabilidad-civil/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-obligaciones-contratos-:ciudad', destination: '/es/servicios/obligaciones-contratos/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-mediacion-:ciudad', destination: '/es/servicios/mediacion/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-extranjeria-:ciudad', destination: '/es/servicios/extranjeria/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-derecho-administrativo-:ciudad', destination: '/es/servicios/derecho-administrativo/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-defensa-fondos-buitre-:ciudad', destination: '/es/servicios/defensa-fondos-buitre/:ciudad', permanent: true },
      { source: '/es/servicios/abogados-negligencias-medicas-:ciudad', destination: '/es/servicios/negligencias-medicas/:ciudad', permanent: true },
      // Redirecciones de /es/abogados/ (landings antiguas) -> nuevas
      { source: '/es/abogados/abogados-accidentes-trafico-:ciudad', destination: '/es/servicios/accidentes-trafico/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-familia-:ciudad', destination: '/es/servicios/derecho-familia/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-bancario-:ciudad', destination: '/es/servicios/derecho-bancario/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-penal-:ciudad', destination: '/es/servicios/derecho-penal/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-inmobiliario-:ciudad', destination: '/es/servicios/derecho-inmobiliario/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-sucesorio-:ciudad', destination: '/es/servicios/derecho-sucesorio/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-mercantil-:ciudad', destination: '/es/servicios/derecho-mercantil/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-responsabilidad-civil-:ciudad', destination: '/es/servicios/responsabilidad-civil/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-obligaciones-contratos-:ciudad', destination: '/es/servicios/obligaciones-contratos/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-mediacion-:ciudad', destination: '/es/servicios/mediacion/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-extranjeria-:ciudad', destination: '/es/servicios/extranjeria/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-derecho-administrativo-:ciudad', destination: '/es/servicios/derecho-administrativo/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-defensa-fondos-buitre-:ciudad', destination: '/es/servicios/defensa-fondos-buitre/:ciudad', permanent: true },
      { source: '/es/abogados/abogados-negligencias-medicas-:ciudad', destination: '/es/servicios/negligencias-medicas/:ciudad', permanent: true },
    ];
  },
};

module.exports = nextConfig;

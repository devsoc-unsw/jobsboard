/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  output: 'standalone',
  reactStrictMode: true
  // TODO(gabriel): fix cors issue with nextjs ssr
  // https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: '/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: 'https://jobsboard.csesoc.unsw.edu.au/' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value:
  //             'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  //         }
  //       ]
  //     }
  //   ];
  // }
};

module.exports = nextConfig;

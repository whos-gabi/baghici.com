/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Extensionless URL for the Magnetron.io privacy policy. The policy itself is a
      // static file in public/ so that it survives any redesign of this site — this
      // rewrite only gives it the clean /magnetron.io/privacy address that is registered
      // in Google Play Console and App Store Connect.
      //
      // app-ads.txt is deliberately NOT here: the IAB spec requires it at the domain
      // root and Google's crawler discards the path, so it must stay at
      // https://baghici.com/app-ads.txt.
      {
        source: '/magnetron.io/privacy',
        destination: '/magnetron.io/privacy.html',
      },
    ]
  },
}

export default nextConfig

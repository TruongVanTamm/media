/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	env: {
		AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_ACCESS_SECRET: process.env.AWS_ACCESS_SECRET,
		AWS_REGION: process.env.AWS_REGION,
		BASE_URL_CDN: process.env.BASE_URL_CDN,
	},

	webpack: (config) => {
		config.resolve = {
			...config.resolve,
			fallback: {
				fs: false,
			},
		};
		return config;
	},
	images: {
		domains: [`demounitvn.s3.ap-southeast-1.amazonaws.com`]
	  }
};

module.exports = nextConfig;

import Head from "next/head";
import React from "react";
import NavMenu from "./Menu";
interface Props {
	title: string;
}
const Layout = ({ title }: Props) => {
	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
				<title>{title ? `${title}` : `Strapi `}</title>
			</Head>
			<NavMenu></NavMenu>
		</>
	);
};

export default Layout;

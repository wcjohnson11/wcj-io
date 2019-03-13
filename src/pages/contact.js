import React from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import NetlifyForm from '../components/netlifyForm';

const Contact = ({ data, location }) => {
	return (
		<Layout location={location}>
			<div>
				<h1>Get in Touch</h1>
                <NetlifyForm />
			</div>
		</Layout>
	);
};

export default Contact;

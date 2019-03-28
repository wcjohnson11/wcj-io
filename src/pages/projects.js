import React from 'react';

import Layout from '../components/layout';
import ProjectListing from '../components/projectListing';

const Projects = ({ location }) => (
	<Layout location={location}>
		<div>
			<h1>Projects</h1>
			<ProjectListing />
		</div>
	</Layout>
);

export default Projects;

import { useEffect, useState } from 'react';

// This function will only work on client side
// Using on the server will result in width and height being undefined
function useWindowSize(){
	const isClient = typeof window === 'object';

	function getSize(){
		return {
			width  : isClient ? window.innerWidth : undefined,
			height : isClient ? window.innerHeight : undefined
		};
	}

	const [
		windowSize,
		setWindowSize
	] = useState(getSize);

	useEffect(() => {
		if (!isClient) {
			return false;
		}

		function handleResize(){
			setWindowSize(getSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
}

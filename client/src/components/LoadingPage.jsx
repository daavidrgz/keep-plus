import Lottie from 'react-lottie';
import animationData from './menu/animations/loading.json';

const defaultOptions = {
	autoplay: true,
	loop: true,
	animationData: animationData,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	}
};

export default function LoadingPage() {
	return (
		<div className="loading-page">
			<Lottie
				options={defaultOptions}
			/>
		</div>

	);
}

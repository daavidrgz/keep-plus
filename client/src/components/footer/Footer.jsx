import React, { useState } from 'react';

export default function Footer(props) {
	const [showFooter, setShowFooter] = useState(false);

	document.addEventListener("scroll", (e) => {
		let maxScroll = window.outerHeight - window.innerHeight - 55;
		let body = document.querySelector("body");
		console.log(window.scrollY, body.offsetHeight);
		if ( window.scrollY === maxScroll )
			setShowFooter(true);
		else
			setShowFooter(false);
	});

	return (
		<footer className={"footer" + (showFooter ? " show-footer":"")}>
			<span className="footer-copy">{"© " + new Date().getFullYear() + " Keep+"}</span>
		</footer>
	);
}

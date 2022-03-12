import React, { useState } from 'react';
import UserPopup from '../popups/UserPopup';

export default function UserProfile({userData}) {
	const [showUserPopup, setShowUserPopup] = useState(false);

	if ( showUserPopup )
		document.addEventListener('click', handleOutClick);
	function handleOutClick(e) {
		let popup;
		popup = document.getElementById("user-popup");
		
		if ( popup && !popup.contains(e.target) ) {
				document.removeEventListener('click', handleOutClick);
				setShowUserPopup(false);
		}
	}

	return (
		<div className="user-image-wraper">
			<img
				className="user-image"
				src={userData.picture} alt="User avatar"
				onClick={() => setShowUserPopup(!showUserPopup)}
			/>
			<UserPopup
				userData={userData}
				show={showUserPopup}
				popupId="user-popup"
			/>
		</div>
		
	);
}

/* eslint-disable no-restricted-globals */
import React from 'react';
import styles from './popups.module.css';

interface UserPopupProps {
	userData: {
		email: string,
		name: string,
		pictuer: string
	}
	show: boolean,
	popupId: string
}

export default function UserPopup(props: UserPopupProps) {
	const firstName = props.userData.name.split(' ')[0];

	return (
		<div id={props.popupId} className={`${styles.userPopup} ${props.show ? styles.showUserPopup: ""}`}>
			<div className={styles.userNameWraper}>
				<span>Hi, <span>{`${firstName[0].toUpperCase()}${firstName.slice(1).toLowerCase()}`}</span></span>
			</div>

			<div className={styles.horizontalRule} style={{margin: '5px 0 20px 0'}}/>

			<div className={styles.userPopupItem} onClick={() => location.assign('/api/logout')}>
				<span>Log Out</span>
				<i className='fi-rs-sign-out'></i>
			</div>
		</div>
	);
}

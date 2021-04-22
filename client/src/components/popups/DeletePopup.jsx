import React, { useContext } from 'react';
import GlobalContext from '../GlobalContext';
import styles from './popups.module.css';

export default function DeletePopup(props) {
	const userEmail = useContext(GlobalContext);

	function handleDelete() {
		fetch("http://localhost:3001/api/delete-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, _ids: props.ids})
		})
		.then(res => res.status !== 200 ? console.log("error") : props.updateNotes());
	}

	return (
		<div className={styles.deleteNotePopup + (props.show ? (" " + styles.showDelete) : "")}>
			<div className={styles.deletePopupTitle}>Are you <span>sure?</span></div>

			<div className={styles.buttonsContainer}>
				<button className={styles.yesBtn + " " + styles.popupBtn} onClick={handleDelete}>
					<span>Yes</span>
					<i className="fi-rs-trash"></i>
				</button>

				<button 
					className={styles.cancelBtn + " " + styles.popupBtn} 
					onClick={() => props.setShowState(false)}
				>
						<span>Cancel</span>
						<i className="fi-rs-cross"></i>
				</button>
			</div>
		</div>
	);
}

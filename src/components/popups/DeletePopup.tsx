import React, { useContext } from 'react';
import GlobalContext from '../GlobalContext';
import styles from './popups.module.css';

interface DeletePopupProps {
	ids: string[];
	show: boolean;
	setShowState: (showState: boolean) => void
	updateNotes: (displayAnimation: boolean) => void
}

export default function DeletePopup(props: DeletePopupProps) {
	const userEmail = useContext(GlobalContext);

	function handleDelete() {
		fetch("/api/delete-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, _ids: props.ids})
		})
		.then(res => res.status !== 200 ? console.log("error") : props.updateNotes(false));
	}

	return (
		<div className={`${styles.deleteNotePopup} ${props.show && styles.showDelete}`}>
			<div className={styles.deletePopupTitle}>Are you <span>sure?</span></div>

			<div className={styles.buttonsContainer}>
				<button className={`${styles.deleteBtn} ${styles.popupBtn}`} onClick={handleDelete}>
					<span>Delete</span>
					<i className="fi-rs-trash"></i>
				</button>

				<button
					className={`${styles.cancelBtn} ${styles.popupBtn}`}
					onClick={() => props.setShowState(false)}
				>
						<span>Cancel</span>
						<i className="fi-rs-cross"></i>
				</button>
			</div>
		</div>
	);
}

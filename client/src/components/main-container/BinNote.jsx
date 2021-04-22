import React, { useContext, useState } from 'react';
import DeletePopup from '../popups/DeletePopup';
import styles from './notes.module.css';
import GlobalContext from '../GlobalContext';

export default function Note(props) {
	const userEmail = useContext(GlobalContext);
	const [showPopup, setShowState] = useState(false);

	function handleRestore() {
		fetch("http://localhost:3001/api/update-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...props.noteData, bin: false})
		})
		.then(res => res.status !== 200 ? console.log("error") : props.updateNotes());
	}
	
	function NoteActionsBar() {
		return (
			<div className={styles.noteActionsBar}>
				<i 
					title="Restore"
					className={styles.noteActionIcon + " fi-rs-rotate-right"}
					onClick={handleRestore}
				/>
				<i
					title="Delete permanently"
					className={styles.noteActionIcon + " fi-rs-trash"}
					onClick={() => setShowState(!showPopup)}
				/>
			</div>
		);
	}

	return (
		<div className={styles.noteWraper}>
			<DeletePopup
				ids={[props.noteData._id]}
				show={showPopup}
				setShowState={setShowState}
				updateNotes={props.updateNotes}
			/>
			<div
				style={{backgroundColor: props.noteData.color}}
				className={styles.note}
			>
				<i className={"fi-rs-trash " + styles.binBg}></i>
				<NoteActionsBar />
				<div className={styles.noteTitle}>{props.noteData.title}</div>
				<div className={styles.noteBody}>{props.noteData.body}</div>
			</div>	
		</div>
		
	);
}

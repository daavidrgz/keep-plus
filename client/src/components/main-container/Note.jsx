import React, { useContext, useState } from 'react';
import styles from './notes.module.css';
import NotePopup from '../popups/NotePopup';
import GlobalContext from '../GlobalContext';

export default function Note(props) {
	const [showPopup, setShowState] = useState(false);
	const [noteContent, setNoteContent] = useState({
		title: props.noteData.title,
		body: props.noteData.body,
		color: props.noteData.color
	});
	const userEmail = useContext(GlobalContext);

	if ( showPopup )
		document.addEventListener('click', handleOutClick);

	function handleOutClick(e) {
		let popup = document.getElementById("note-popup-" + props.noteData._id);
		if ( popup != null ) {
			let popupChilds = Array.from(popup.querySelectorAll('*'));
			
			if ( popup !== e.target && popupChilds.every(elem => elem !== e.target) ) {
				document.removeEventListener('click', handleOutClick);
				setShowState(false);
			}

		} else {
			document.removeEventListener('click', handleOutClick);
			setShowState(false);
		}
			
	}

	function handleBookmark() {
		fetch("http://localhost:3001/api/update-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...props.noteData, ...noteContent, fav: !props.noteData.fav})
		})
		.then(res => res.status !== 200 ? console.log("error") : props.updateNotes());
	}
	function handleMoveToBin() {
		fetch("http://localhost:3001/api/update-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...props.noteData, ...noteContent, bin: true})
		})
		.then(res => res.status !== 200 ? console.log("error") : props.updateNotes());
	}
	
	function NoteActionsBar(actionProps) {
		return (
			<div className={styles.noteActionsBar}>
				<i 
					title="Edit"
					className={styles.noteActionIcon + " fi-rs-pencil"}
					onClick={() => setShowState(!showPopup)}
				/>
				<i
					title="See more"
					className={styles.noteActionIcon + " fi-rs-eye"}
				/>
				<i 
					title={actionProps.bookmarked ? "Un-bookmark":"Bookmark"}
					className={styles.noteActionIcon + " " + (actionProps.bookmarked ? "fi-ss-bookmark":"fi-rs-bookmark")}
					onClick={handleBookmark}
				/>
				<i
					title="Move to bin"
					className={styles.noteActionIcon + " fi-rs-trash"}
					onClick={handleMoveToBin}
				/>
			</div>
		);
	}

	return (
		<div className={styles.noteWraper}>
			<NotePopup
				setNoteContent={setNoteContent}
				noteData={props.noteData}
				show={showPopup}
				popupId={"note-popup-" + props.noteData._id}
				popupTitle="Edit"
			/>

			<div
				style={{backgroundColor: noteContent.color}}
				className={styles.note + (props.noteData.fav ? " " + styles.favNote:"")}
			>
				<NoteActionsBar bookmarked={props.noteData.fav}/>
				<div className={styles.noteTitle}>{noteContent.title}</div>
				<div className={styles.noteBody}>{noteContent.body}</div>
			</div>	
		</div>
		
	);
}

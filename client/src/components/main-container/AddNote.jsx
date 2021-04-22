import React, {useState} from 'react';
import NotePopup from '../popups/NotePopup';
import styles from './notes.module.css';

export default function AddNoteButton(props) {
	const [showPopup, setState] = useState(false);

	if ( showPopup )
		document.addEventListener('click', handleOutClick);
	function handleOutClick(e) {
		let popup = document.getElementById('create-note-popup');

		if ( popup != null ) {
			let popupChilds = Array.from(popup.querySelectorAll('*'));
			
			if ( popup !== e.target && popupChilds.every(elem => elem !== e.target) ) {
				document.removeEventListener('click', handleOutClick);
				setState(false);
			}

		} else {
			document.removeEventListener('click', handleOutClick);
			setState(false);
		}
	}

	return (
		<div className={styles.addNote}>
			<NotePopup
				setNoteContent={props.updateNotes}
				noteData={{title: "", body: "", color: "#fff3e6"}}
				show={showPopup}
				popupId="create-note-popup"
				popupTitle="Add"
			/>

			<div title="Add note" className={styles.addNoteArea} onClick={() => setState(!showPopup)}>
				<i className={styles.addNoteIcon + " fi-rs-add"} />
			</div>
		</div>
	);
}

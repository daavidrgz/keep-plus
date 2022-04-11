import {useState} from 'react';
import NotePopup from '../popups/NotePopup';
import styles from './notes.module.css';

interface AddNoteButtonProps {
	updateNotes: (displayAnimation: boolean) => void
}

export default function AddNoteButton(props: AddNoteButtonProps) {
	const [showPopup, setState] = useState(false);

	if ( showPopup )
		document.addEventListener('click', handleOutClick);
	function handleOutClick(e: globalThis.MouseEvent) {
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
		<div className={styles.addNoteWraper}>
			<NotePopup
				setNoteContent={props.updateNotes} // We call the updateNotes to refresh the notes container
				noteData={{title: "", body: "", color: "#fff3e6", category: "Unset"}}
				show={showPopup}
				popupId="create-note-popup"
				popupTitle="Add"
			/>

			<div title="Add Note" className={styles.addNote} onClick={() => setState(!showPopup)}>
				<span className={styles.addNoteBtn}>Add <span>Note</span></span>
				<i className={`${styles.addNoteIcon} fi-rs-plus`} />
			</div>
		</div>
	);
}

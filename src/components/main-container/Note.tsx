import React, { useContext, useState, useEffect } from 'react';
import styles from './notes.module.css';
import NotePopup from '../popups/NotePopup';
import CompleteNote from '../popups/CompleteNote';
import GlobalContext from '../GlobalContext';
import categories from '../Categories.js';

interface NoteData {
	_id: string,
	title: string,
	body: string,
	date: string,
	fav: boolean,
	bin: boolean,
	category: string,
	color: string
}

interface NoteProps {
	noteData: NoteData,
	updateNotes: (displayAnimation: boolean) => void,
}

export default function Note({noteData, updateNotes}: NoteProps) {
	const [showEditPopup, setShowEditState] = useState(false);
	const [showViewPopup, setShowViewState] = useState(false);
	const [noteBackground, setNoteBackground] = useState("unset");
	const [noteContent, setNoteContent] = useState({
		title: noteData.title,
		body: noteData.body,
		color: noteData.color,
		category: noteData.category
	});
	const userEmail = useContext(GlobalContext);

	if ( showEditPopup || showViewPopup ) document.addEventListener('click', handleOutClick);
	function handleOutClick(e: globalThis.MouseEvent) {
		let popup: HTMLElement | null;

		if ( showEditPopup )
			popup = document.getElementById("note-popup-" + noteData._id);
		else
			popup = document.getElementById("view-popup-" + noteData._id);
		 
		if ( popup && !popup.contains(e.target as Node) ) {
				document.removeEventListener('click', handleOutClick);
				setShowEditState(false);
				setShowViewState(false);
		}
	}
	useEffect(() => {
		document.addEventListener('click', handleOutClick, true);
		return () => document.removeEventListener('click', handleOutClick, true);
	});

	useEffect(() => {
		if ( noteContent.category !== "Unset" ) {
			let category = categories.find(c => c.text === noteContent.category)!;
			setNoteBackground(category.img);
		} else
			setNoteBackground("unset");
	}, [noteContent.category]);

	function handleNoteChange(param: {[key: string]: boolean}) {
		fetch("/api/update-note", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...noteData, ...noteContent, ...param})
		})
		.then(res => res.status !== 200 ? console.log("error") : updateNotes(false));
	}
	
	function NoteActionsBar(actionProps: {bookmarked: boolean}) {
		return (
			<div className={styles.noteActionsBar}>
				<i 
					title="Edit"
					className={`${styles.noteActionIcon} fi-rs-pencil`}
					onClick={() => setShowEditState(!showEditPopup)}
				/>
				<i
					title="See more"
					className={`${styles.noteActionIcon} fi-rs-eye`}
					onClick={() => setShowViewState(!showViewPopup)}
				/>
				<i 
					title={actionProps.bookmarked ? "Un-bookmark":"Bookmark"}
					className={`${styles.noteActionIcon} ${actionProps.bookmarked ? 'fi-ss-bookmark':'fi-rs-bookmark'}`}
					onClick={() => handleNoteChange({fav: !noteData.fav})}
				/>
				<i
					title="Move to bin"
					className={`${styles.noteActionIcon} fi-rs-trash`}
					onClick={() => handleNoteChange({bin: true})}
				/>
			</div>
		);
	}

	return (
		<div className={styles.noteWraper}>
			<NotePopup
				setNoteContent={setNoteContent}
				noteData={noteData}
				show={showEditPopup}
				popupId={"note-popup-" + noteData._id}
				popupTitle="Edit"
			/>
			<CompleteNote
				noteData={noteContent}
				show={showViewPopup}
				popupId={"view-popup-" + noteData._id}
			/>

			<div
				style={{backgroundColor: noteContent.color}}
				className={`${styles.note} ${noteData.fav && styles.favNote}`}
			>
				<i className={`${noteBackground} ${styles.noteBg}`}></i>
				<NoteActionsBar bookmarked={noteData.fav}/>
				<div className={styles.noteTitle}>{noteContent.title}</div>
				<div className={styles.noteBody}>{noteContent.body}</div>
			</div>	
		</div>
		
	);
}

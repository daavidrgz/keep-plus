import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from './notes.module.css';
import Note from './Note';
import BinNote from './BinNote';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';

interface SearchNotesProps {
	searchContent: string,
	showMenu: boolean
}

function renderNote(note: NoteData, updateNotes: () => void) {
	return (
		note.bin ?
		<BinNote
			key={note._id}
			updateNotes={updateNotes}
			noteData={note}
		/>
		:
		<Note
			key={note._id}
			updateNotes={updateNotes}
			noteData={note}
		/>
	);
}

function createNotes(notesData: NoteData[], updateNotes: () => void) {
	return notesData.map(note => renderNote(note, updateNotes));
}

export default function SearchNotes(props: SearchNotesProps) {
	const [notes, setNotes] = useState<NoteData[]>([]);
	const [filteredNotes, setFilteredNotes] = useState<JSX.Element[]>([]);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback(() => {
		getNotes(userEmail, {bin: null, category: 'all'})
		.then(notesData => setNotes(notesData))
	}, [userEmail]);

	useEffect(() => {
		updateNotes();
	}, [updateNotes]);

	useEffect(() => {
		let content = props.searchContent.toLowerCase();
		let filteredNotes = notes.filter(note => (note.title + note.body).toLowerCase().includes(content));
		setFilteredNotes(createNotes(filteredNotes, updateNotes));
	}, [props.searchContent, userEmail, notes, updateNotes]);

	return (
		<div
			id="external-notes-container"
			className={`${styles.externalNotesContainer} ${props.showMenu && "external-notes-container-move"}`}
		>
			<div className={styles.searchTitle}>
				<span>Searching for: <span>{`"${props.searchContent}"`}</span></span>
			</div>
			<div className={styles.notesContainer}>
				{filteredNotes}
			</div>
		</div>
	);
}

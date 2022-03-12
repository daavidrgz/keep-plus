import React, { useCallback, useContext, useEffect, useState } from 'react';
import AddNoteButton from './AddNoteButton';
import Note from './Note';
import anime from 'animejs';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';
import styles from './notes.module.css';

function renderNote(note: NoteData, updateNotes: (displayAnimation: boolean) => void) {
	return (
		<Note
			key={note._id}
			updateNotes={updateNotes}
			noteData={note}
		/>
	);
}

function createNotes(notesData: NoteData[], updateNotes: (displayAnimation: boolean) => void) {
	let favNotes: JSX.Element[] = [];
	let normalNotes: JSX.Element[] = [];

	notesData.forEach(note => {
		note.fav ? favNotes.push(renderNote(note, updateNotes)) : normalNotes.push(renderNote(note, updateNotes));
	});
	return [favNotes, normalNotes];
}

function Header(headerProps: {text: string, img: string}) {
	return (
		<div className={styles.notesHeader}>
			<span className={styles.notesHeaderText}>{headerProps.text.slice(0, 3)}<span>{headerProps.text.slice(3)}</span></span>
			<i className={headerProps.img}></i>
		</div>
	);
}

export default function AllNotes(props: {showMenu: boolean}) {
	const [[favNotes, normalNotes], setNotesData] = useState<JSX.Element[][]>([[], []]);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback((displayAnimation: boolean) => {
		getNotes(userEmail, {bin: false, category: 'all'})
		.then(notesData => {
			setNotesData(createNotes(notesData, updateNotes));

			if ( !displayAnimation ) return;

			const targets = Array.from(document.getElementsByClassName(styles.note));
			if ( targets === null ) return;

			anime({
				targets: targets,
				translateY: ['100px', '0px'],
				opacity: ['0%', '100%'],
				duration: 300,
				easing: 'easeOutSine',
				delay: targets.length>1 ? anime.stagger(50, {easing: 'easeOutCubic'}) : 50
			});
		});
	}, [userEmail]);

	useEffect(() => {
		updateNotes(true);
	}, [updateNotes]);

	return (
		<div
			id="external-notes-container"
			className={`${styles.externalNotesContainer}${props.showMenu ? ' external-notes-container-move':''}`}
		>
			<AddNoteButton updateNotes={updateNotes} />
			<div className={styles.notesContainer}>
				<Header text="Bookmarked" img="fi-ss-bookmark" />
				{favNotes} 
			</div>
			<div className={styles.notesContainer}>
				<Header text="Notes" img="fi-rs-book-alt" />
				{normalNotes}	
			</div>
		</div>
	);
}

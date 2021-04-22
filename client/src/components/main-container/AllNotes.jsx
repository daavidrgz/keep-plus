import React, { useCallback, useContext, useEffect, useState } from 'react';
import AddNote from './AddNote';
import Note from './Note';
import anime from 'animejs/lib/anime.es.js';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';
import styles from './notes.module.css';

function renderNote(note, updateNotes) {
	return (
		<Note
			key={note._id}
			updateNotes={updateNotes}
			noteData={note}
		/>
	);
}

function createNotes(notesData, updateNotes) {
	let favNotes = [];
	let normalNotes = [];

	notesData.forEach(note => {
		note.fav ? favNotes.push(renderNote(note, updateNotes)) : normalNotes.push(renderNote(note, updateNotes));
	});

	return [favNotes, normalNotes];
}

function Header(headerProps) {
	return (
		<div className={styles.notesHeader}>
			<span className={styles.notesHeaderText}>{headerProps.text.slice(0, 3)}<span>{headerProps.text.slice(3)}</span></span>
			<i className={headerProps.img}></i>
			{/* <div className={styles.horizontalRule}></div> */}
		</div>
	);
}

export default function AllNotes(props) {
	const [[favNotes, normalNotes], setNotesData] = useState([[], []]);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback(() => {
		getNotes(userEmail, {bin: false, category: "all"})
		.then(notesData => {
			setNotesData(createNotes(notesData, updateNotes));

			const targets = Array.from(document.getElementsByClassName(styles.note));
			targets.push(document.querySelector("." + styles.addNoteArea));

			if ( targets === null )
				return;
				
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
		updateNotes();
	}, [updateNotes]);

	return (
		<div id="external-notes-container" 
			className={styles.externalNotesContainer + " " + (props.showMenu ? "external-notes-container-move": "")}
		>
			<div className={styles.notesContainer}>
				<Header
					text="Bookmarked"
					img="fi-ss-bookmark"
				/>
				{/* FAV NOTES ARRAY */}
				{favNotes} 
			</div>
			<div className={styles.notesContainer}>
				<Header
					text="Notes"
					img="fi-rs-book-alt"
				/>
				{/* NORMAL NOTES ARRAY */}
				<AddNote
					key={Math.random()}
					updateNotes={updateNotes}
				/>
				{normalNotes}	
			</div>
		</div>
	);
}

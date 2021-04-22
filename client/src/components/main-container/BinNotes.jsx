import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from './notes.module.css';
import BinNote from './BinNote';
import DeletePopup from '../popups/DeletePopup';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';
import anime from 'animejs/lib/anime.es';

function renderNote(note, updateNotes) {
	return (
		<BinNote
			key={note._id}
			noteData={note}
			updateNotes={updateNotes}
		/>
	);
}

function createNotes(notesData, updateNotes) {
	let notes = [];
	notesData.forEach(note => {
		notes.push(renderNote(note, updateNotes));
	});
	return notes;
}

function Header(headerProps) {
	return (
		<div className={styles.notesHeader}>
			<span className={styles.notesHeaderText}>{headerProps.text.slice(0,7)}<span>{headerProps.text.slice(7)}</span></span>
			<i className={headerProps.img} />
		</div>
	);
}

export default function BinNotes(props) {
	const [notes, setNotesData] = useState([""]);
	const [showPopup, setShowState] = useState(false);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback(() => {
		getNotes(userEmail, {bin: true, category: "all"})
		.then(notesData => {
			document.querySelector('.loading-page').classList.remove('show-loading-page');
			setNotesData(createNotes(notesData, updateNotes));
			const targets = Array.from(document.getElementsByClassName(styles.note));

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
			{(notes[0] !== "") && (( notes.length === 0 ) ?
				<div className={styles.searchTitle} key={Math.random()}>
					<span>The bin <span>is empty</span></span>
				</div>
				:
				<div className={styles.deleteAllWraper}>
					<DeletePopup 
						ids={notes.map(note => note.props.noteData._id)}
						show={showPopup}
						setShowState={setShowState}
						updateNotes={updateNotes}
					/>
					<div className={styles.deleteAllBtn} onClick={() => setShowState(!showPopup)}>
						<span>Delete all</span>
						<i className="fi-rs-cross-circle"></i>
					</div>
				</div>)
			}
			<div className={styles.notesContainer}>
				{(notes.length !== 0) &&
				<Header
					text="Recycle Bin"
					img="fi-rs-trash"
				/>}
				{notes} 
			</div>
		</div>
	);
}

import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from './notes.module.css';
import BinNote from './BinNote';
import DeletePopup from '../popups/DeletePopup';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';
import anime from 'animejs';

function renderNote(note: NoteData, updateNotes: (displayAnimation: boolean) => void) {
	return (
		<BinNote
			key={note._id}
			noteData={note}
			updateNotes={updateNotes}
		/>
	);
}

function createNotes(notesData: NoteData[], updateNotes: (displayAnimation: boolean) => void) {
	return notesData.map(note => renderNote(note, updateNotes));
}

function Header(headerProps: {text: string, img: string}) {
	return (
		<div className={styles.notesHeader}>
			<span className={styles.notesHeaderText}>{headerProps.text.slice(0,7)}<span>{headerProps.text.slice(7)}</span></span>
			<i className={headerProps.img} />
		</div>
	);
}

export default function BinNotes(props: {showMenu: boolean}) {
	const [notes, setNotesData] = useState<JSX.Element[] | null>(null);
	const [showPopup, setShowState] = useState(false);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback((displayAnimation) => {
		getNotes(userEmail, {bin: true, category: "all"})
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
			className={`${styles.externalNotesContainer} ${props.showMenu && "external-notes-container-move"}`}
		>
			{( notes ) && (notes.length === 0 ?
				<div className={styles.searchTitle}>
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
						<span>Delete <span>All</span></span>
						<i className="fi-rs-cross-circle"></i>
					</div>
				</div>
			)}
			<div className={styles.notesContainer}>
				{( notes ) && ( notes.length !== 0 ) &&
					<Header
						text="Recycle Bin"
						img="fi-rs-trash"
					/>
				}
				{notes} 
			</div>
		</div>
	);
}

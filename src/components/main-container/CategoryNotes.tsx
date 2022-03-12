import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from './notes.module.css';
import Note from './Note';
import getNotes from './getNotes.js';
import GlobalContext from '../GlobalContext.js';
import anime from 'animejs';

interface CategoryNotesProps {
	category: {
		text: string,
		img: string
	},
	showMenu: boolean
}

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
	return notesData.map(note => renderNote(note, updateNotes));
}

function Header(headerProps: {text: string, img: string}) {
	return (
		<div className={styles.notesHeader}>
			<span className={styles.notesHeaderText}>{headerProps.text.slice(0,4)}<span>{headerProps.text.slice(4)}</span></span>
			<i className={headerProps.img} />
		</div>
	);
}

export default function CategoryNotes(props: CategoryNotesProps) {
	const [notes, setNotesData] = useState<JSX.Element[] | null>(null);
	const userEmail = useContext(GlobalContext);

	const updateNotes = useCallback((displayAnimation) => {
		setNotesData(null);

		getNotes(userEmail, {bin: false, category: props.category.text})
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
	}, [userEmail, props.category]);

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
					<span>There aren't notes <span>{`in ${props.category.text}`}</span></span>
				</div>
				:
				<div className={styles.notesContainer}>
					<Header 
						text={props.category.text}
						img={props.category.img}
					/>
					{notes} 
				</div>
			)}
		</div>
	);
}

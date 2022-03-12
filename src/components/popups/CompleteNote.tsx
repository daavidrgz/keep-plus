import React from 'react';
import styles from './popups.module.css';

interface CompleteNoteProps {
	noteData: {
		title: string,
		body: string,
		color: string,
		category: string
	};
	show: boolean;
	popupId: string;
}

export default function CompleteNote(props: CompleteNoteProps) {
	return (
		<div 
			id={props.popupId}
			style={{backgroundColor: props.noteData.color}}
			className={`${styles.completeNote} ${props.show && styles.show}`}
		>
			<div className={styles.completeNoteTitle}>{props.noteData.title}</div>
			<div className={styles.horizontalRule} />
			<div className={styles.completeNoteBody}>{props.noteData.body}</div>
		</div>
	);
}

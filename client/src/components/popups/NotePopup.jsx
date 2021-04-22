import React, { useContext, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker';
import GlobalContext from '../GlobalContext';
import styles from './popups.module.css';

export default function NotePopup(props) {
	const [noteContent, setNoteContent] = useState({
		title: props.noteData.title,
		body: props.noteData.body,
		color: props.noteData.color
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const userEmail = useContext(GlobalContext);

	useEffect(() => {
		if ( !props.show )
			setShowColorPicker(false);
	}, [props.show])

	function handleChange(e) {
		const {name, value} = e.target;
		setNoteContent(prevValue => ({...prevValue, [name]: value}));
	}
	function handleSubmit(e) {
		e.preventDefault();
		updateNote(noteContent);
		document.querySelector('.nav-bar').click();
	}
	function handleColorChange(color) {
		setNoteContent(prevValue => ({...prevValue, color: color}));
		if ( props.popupTitle === "Edit" )
			updateNote({...noteContent, color: color});
	}
 	
	function updateNote(noteContent) {
		let endpoint = (props.popupTitle === "Edit" ? "/update-note" : "/add-note");
		
		fetch("http://localhost:3001/api" + endpoint, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...props.noteData, ...noteContent})
		}).then(res => res.status !== 200 ? console.error("error") : props.setNoteContent(noteContent));
	}

	return (
		<form id={props.popupId} className={styles.addNotePopup + (props.show ? (" " + styles.show) : "")} 
			onSubmit={handleSubmit}
		>
			<div className={styles.popupTitleWraper}>
				<div className={styles.popupTitle}>
					{props.popupTitle}
					<span> Note</span>
					
				</div>
				<div className={styles.colorPickerWraper}>
					<div
						title="Color picker"
						style={{backgroundColor: noteContent.color}}
						className={styles.colorPickerBtn}
						onClick={() => setShowColorPicker(!showColorPicker)}
					/>

					<ColorPicker
						show={showColorPicker}
						setShowColorPicker={setShowColorPicker}
						setNoteColor={handleColorChange}
					/>
				</div>
				
			</div>
			

			<div className={styles.noteTitleWraper}>
				<div className={styles.noteFieldText}>Title:</div>
				<input 
					className={styles.noteTitleInput} type="text" name="title" placeholder="Note title" autoComplete="off"
					value={noteContent.title}
					onChange={handleChange}
				/>
				<div id={props.popupId + "title-bar"} className={styles.inputBar}></div>
			</div>

			<div className={styles.noteBodyWraper}>
				<div className={styles.noteFieldText}>Body:</div>
				<textarea 
					className={styles.noteBodyInput} type="text" name="body" spellCheck="false" placeholder="Note body"
					value={noteContent.body}
					onChange={handleChange}
				/>
				<div id={props.popupId + "body-bar"} className={styles.inputBar}></div>
			</div>
	
			<div className={styles.buttonsContainer}>
				<button 
					type="reset" className={styles.resetBtn + " " + styles.popupBtn} 
					onClick={() => setNoteContent({title: props.noteData.title, body: props.noteData.body, color: props.noteData.color})}>
						<span>Discard changes</span>
						<i className="fi-rs-cross"></i>
				</button>

				<button type="submit" className={styles.saveBtn + " " + styles.popupBtn}>
					<span>Save</span>
					<i className="fi-rs-disk"></i>
				</button>
			</div>
		</form>
	);
}

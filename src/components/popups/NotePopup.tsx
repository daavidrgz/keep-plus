import { useContext, useEffect, useState, ChangeEvent } from 'react';
import ColorPicker from './ColorPicker';
import CategoryPopup from './CategoryPopup';
import GlobalContext from '../GlobalContext';
import styles from './popups.module.css';

interface AllNoteData {
	_id?: string,
	title: string,
	body: string,
	date?: string,
	fav?: boolean,
	bin?: boolean,
	category: string,
	color: string
}
interface NoteContent {
	title: string,
	body: string,
	category: string,
	color: string
}
interface NotePopupProps {
	noteData: AllNoteData
	show: boolean;
	popupId: string,
	popupTitle: string;
	setNoteContent: (any: any) => void;
}

export default function NotePopup(props: NotePopupProps) {
	const [noteContent, setNoteContent] = useState({
		title: props.noteData.title,
		body: props.noteData.body,
		color: props.noteData.color,
		category: props.noteData.category
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showCategoryPopup, setShowCategoryPopup] = useState(false);
	const userEmail = useContext(GlobalContext);

	useEffect(() => {
		setShowColorPicker(false);
		setShowCategoryPopup(false);
	}, [props.show]);

	( showCategoryPopup || showColorPicker ) && document.addEventListener('click', handleOutClick);
	function handleOutClick(e: globalThis.MouseEvent) {
		let popup: HTMLElement | null;
		
		if ( showCategoryPopup )
			popup = document.getElementById(`category-popup-${props.popupId}`);
		else
			popup = document.getElementById(`color-picker-popup-${props.popupId}`);
		
		if ( popup && !popup.contains(e.target as Node) ) {
				document.removeEventListener('click', handleOutClick);

				if ( showCategoryPopup )
					setShowCategoryPopup(false);
				else
					setShowColorPicker(false);
		}
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const {name, value} = e.currentTarget;
		setNoteContent(prevValue => ({...prevValue, [name]: value}));
	}

	function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
		e.preventDefault();
		updateNote(noteContent);
		if ( props.popupTitle === "Add" )
			setNoteContent({...props.noteData}); // Resetting the inital empty values

		document.querySelector<HTMLElement>('.nav-bar')!.click(); // Hiding the popup
	}

	function handlePropertyChange(property: {[propertyType: string]: string}) {
		setNoteContent(prevValue => ({...prevValue, ...property}));
		if ( props.popupTitle === "Edit" )
			updateNote({...noteContent, ...property});
	}
 	
	function updateNote(noteContent: NoteContent) {
		// If we add a note, the function setNoteContent calls updateNotes => animation should be false
		let [endpoint, param] = (props.popupTitle === "Edit" ? ["/update-note", noteContent] : ["/add-note", false]);

		fetch("/api" + endpoint, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: userEmail, ...props.noteData, ...noteContent})
		}).then(res => res.status !== 200 ? console.error("error") : props.setNoteContent(param));
	}

	return (
		<form 
			id={props.popupId} 
			className={`${styles.addNotePopup} ${props.show && styles.show}`}
			onSubmit={handleSubmit}
		>
			<div className={styles.popupTitleWraper}>
				<div className={styles.popupTitle}>
					{props.popupTitle}<span> Note</span>
				</div>

				<div className={styles.rightTitleContainer}>
					<div className={styles.categoryWraper}>
						<div
							title="Change category"
							className={styles.categoryBtn}
							onClick={() => setShowCategoryPopup(!showCategoryPopup)}
						>
							<span>Category</span>
							<i className={"fi-rs-angle-down"}></i>
						</div>

						<CategoryPopup
							popupId={`category-popup-${props.popupId}`}
							category={noteContent.category}
							show={showCategoryPopup}
							setNoteProperty={handlePropertyChange}
						/>
					</div>

					<div className={styles.colorPickerWraper}>
						<div
							title="Color picker"
							style={{backgroundColor: noteContent.color}}
							className={styles.colorPickerBtn}
							onClick={() => setShowColorPicker(!showColorPicker)}
						/>

						<ColorPicker
							popupId={`color-picker-popup-${props.popupId}`}
							show={showColorPicker}
							setNoteProperty={handlePropertyChange}
						/>
					</div>
				</div>
			</div>

			<div className={styles.noteTitleWraper}>
				<div className={styles.noteFieldText}>Title:</div>
				<input 
					className={styles.noteTitleInput} type="text" name="title" placeholder="Note title" autoComplete="off"
					value={noteContent.title}
					onChange={handleInputChange}
				/>
				<div id={props.popupId + "title-bar"} className={styles.inputBar}></div>
			</div>

			<div className={styles.noteBodyWraper}>
				<div className={styles.noteFieldText}>Body:</div>
				<textarea 
					className={styles.noteBodyInput} name="body" spellCheck="false" placeholder="Note body"
					value={noteContent.body}
					onChange={handleInputChange}
				/>
				<div id={props.popupId + "body-bar"} className={styles.inputBar}></div>
			</div>
	
			<div className={styles.buttonsContainer}>
				<button
					type="reset" className={styles.resetBtn + " " + styles.popupBtn} 
					onClick={() => setNoteContent(props.noteData)}>
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

import React, { useState } from 'react';
import styles from './popups.module.css';

function ColorItem(colorProps) {
	return (
		<div>
			<div 
				style={{backgroundColor: colorProps.color}} 
				className={styles.colorSelector + " " + (colorProps.show ? styles.showColorSelector:"")}
				onClick={() => colorProps.setNoteColor(colorProps.color)}
			>
			</div>
		</div>
	);
}

export default function ColorPicker(props) {
	const colors = ['#29bb89', '#e48257', '#c64756e1', '#fad586', '#f39189', '#9fd8df', '#b4aee8', '#fff3e6', '#a3ddcb'];

	return (
		<div className={styles.colorPickerContainer + " " + (props.show ? styles.showColorPicker:"")}>
			{colors.map((color, index) => 
				<ColorItem
					key={index}
					color={color}
					show={props.show}
					setNoteColor={props.setNoteColor}
				/>)}
		</div>
	);
}

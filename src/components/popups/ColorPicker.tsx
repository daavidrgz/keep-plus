import React from 'react';
import styles from './popups.module.css';

interface ColorPickerProps {
	show: boolean;
	popupId: string;
	setNoteProperty: (property: {color: string}) => void;
}
interface ColorSelectorProps {
	show: boolean;
	color: string;
	setNoteProperty: (property: {color: string}) => void;
}

function ColorItem(colorProps: ColorSelectorProps) {
	return (
		<div>
			<div 
				style={{backgroundColor: colorProps.color}} 
				className={`${styles.colorSelector} ${colorProps.show && styles.showColorSelector}`}
				onClick={() => colorProps.setNoteProperty({color: colorProps.color})}
			/>
		</div>
	);
}

export default function ColorPicker(props: ColorPickerProps) {
	const colors = ['#29bb89', '#e48257', '#b9525e', '#fad586', '#f39189', '#9fd8df', '#b4aee8', '#fff3e6', '#a3ddcb'];

	return (
		<div id={props.popupId} className={`${styles.colorPickerContainer} ${props.show && styles.showColorPicker}`}>
			{colors.map((color, index) => 
				<ColorItem
					key={index}
					color={color}
					show={props.show}
					setNoteProperty={props.setNoteProperty}
				/>
			)}
		</div>
	);
}

import React from 'react';
import styles from './popups.module.css';
import categories from '../Categories.js';

interface ItemProps {
	categoryName: string;
	currentCategory: string;
	categoryIcon: string;
	show: boolean;
	setNoteProperty: (property: {category: string}) => void;
}
interface CategoryProps {
	category: string;
	show: boolean;
	popupId: string,
	setNoteProperty: (property: {category: string}) => void;
}

function CategoryItem(itemProps: ItemProps) {
	return (
		<div
			style={{backgroundColor: (itemProps.currentCategory === itemProps.categoryName ? 'var(--hover-color)' : "")}}
			className={`${styles.categoryItem} ${itemProps.show && styles.showCategoryItem}`}
			onClick={() => itemProps.setNoteProperty({category: itemProps.categoryName})}
		>
			<span>{itemProps.categoryName}</span>
			<i className={`${styles.categoryIcon} ${itemProps.categoryIcon}`} />
		</div>
	);
}

export default function CategoryPopup(props: CategoryProps) {
	const allCategories = [
		...categories, {
		text: 'Unset',
		img: 'fi-rs-ban'
	}];

	return (
		<div id={props.popupId} className={`${styles.categoryContainer} ${props.show && styles.showCategories}`}>
			{allCategories.map((category, index) => 
				<CategoryItem
					key={index}
					categoryName={category.text}
					currentCategory={props.category}
					categoryIcon={category.img}
					show={props.show}
					setNoteProperty={props.setNoteProperty}
				/>)}
		</div>
	);
}

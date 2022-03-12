import React, { useEffect, useState } from 'react';
import categories from '../Categories.js';
import animationData from './animations/bin-white-animation.json';

const defaultOptions = {
	autoplay: false,
	loop: false,
	animationData: animationData,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	}
};

interface MenuItemProps {
	text: string,
	img: string,
	isActive: boolean,
	setMainView: (view: {text: string, img: string}) => void;
	setShowMenu: (showMenu: boolean) => void;
}
interface MenuProps {
	mainView: {
		text: string,
		img: string,
	};
	showMenu: boolean;
	setMainView: (view: {text: string, img: string}) => void;
	setShowMenu: (showMenu: boolean) => void;
}

function Item(itemProps: MenuItemProps) {
	const [animationState, setState] = useState(true);
	
	function handleClick() {
		setState(!animationState);
		itemProps.setMainView({
			text: itemProps.text,
			img: itemProps.img,
		});
		itemProps.setShowMenu(false);
	}

	return (
		<div className="menu-item" onClick={handleClick} title={itemProps.text}>
			<span style={{width: itemProps.isActive ? '100%':''}}></span>
			<div className="menu-item-bar" style={{opacity: itemProps.isActive ? '100%':''}}></div>
			<i className={`${itemProps.img} menu-item-icon`} />
			<div className="menu-item-text">{itemProps.text}</div>
		</div>
	);
}

const menuItems =
[{
	text: "All",
	img: "fi-rs-apps"
},
...categories,
{
	text: "Bin",
	img: "fi-rs-trash"
}];

export default function Menu(props: MenuProps) {
	const [activeItems, setItemsActive] = useState([true, false, false, false]);

	useEffect(() => {
		let index = menuItems.findIndex(item => item.text === props.mainView.text);
		setItemsActive(prevValue => prevValue.map((e, i) => i === index ? true : false));

	}, [props.mainView]);

	return (
		<div className={`menu-container ${props.showMenu && "show-menu"}`}>
			<div className="menu-items-wraper">
				{menuItems.map((item, idx) => {
					return (
						<Item
							key={idx}
							text={item.text}
							img={item.img}
							setMainView={props.setMainView}
							isActive={activeItems[idx]}
							setShowMenu={props.setShowMenu}
						/>
					);
				})}
			</div>
		</div>
	);
}

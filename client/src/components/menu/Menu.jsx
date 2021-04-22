import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from './animations/bin-white-animation.json';

const defaultOptions = {
	autoplay: false,
	loop: false,
	animationData: animationData,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	}
};

function Item(itemProps) {
	const [animationState, setState] = useState(true);
	
	function handleClick() {
		setState(!animationState);
		itemProps.setMainView(itemProps.text);
	}

	return (
		<div className="menu-item" onClick={handleClick}>
			<span style={{width: itemProps.isActive ? '100%':''}}></span>
			<div className="menu-item-bar" style={{opacity: itemProps.isActive ? '100%':''}}></div>
			{( itemProps.img === "" ) ? 
				<div className="menu-item-icon">
						<Lottie
							options={defaultOptions}
							isStopped={animationState}
						/>
				</div>
			:
				<i className={"menu-item-icon " + itemProps.img}></i>
			}
			<div className="menu-item-text">{itemProps.text}</div>
		</div>
	);
}

export default function Menu(props) {
	const [[all, personal, important, bin], setItemsActive] = useState([true, false, false, false]);

	useEffect(() => {
		if ( props.mainView === "Search" )
			setItemsActive([true, false, false, false]);
		if ( props.mainView === "Bin" )
			setItemsActive([false, false, false, true]);
		if ( props.mainView === "All" )
			setItemsActive([true, false, false, false]);

	}, [props.mainView])

	return (
		<div className={"menu-container " + (props.showMenu ? "show-menu" : "")}>
			<div className="menu-items-wraper">
				<Item
					text="All"
					img="fi-rs-apps"
					setMainView={props.setMainView}
					isActive={all}
				/>
				<Item
					text="Personal"
					img="fi-rs-portrait"
					setMainView={props.setMainView}
					isActive={personal}
				/>
				<Item 
					text="Important"
					img="fi-rs-exclamation"
					setMainView={props.setMainView}
					isActive={important}
				/>
				<Item
					text="Bin"
					img="fi-rs-trash"
					setMainView={props.setMainView}
					isActive={bin}
				/>
			</div>
		</div>
	);
}

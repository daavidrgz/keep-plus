import React from 'react';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';

interface NavProps {
	setMainView: React.Dispatch<React.SetStateAction<{text: string, img: string}>>
	setSearchContent: React.Dispatch<React.SetStateAction<string>>,
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>,
	userData: {
		email: string,
		name: string,
		picture: string
	}
}

export default function Nav(props: NavProps) {
	return (
		<nav className="nav-bar">
			<div className="nav-container">
				<i
					className="toggle-menu-icon fi-rs-menu-burger"
					onClick={() => props.setShowMenu(prevValue => !prevValue)}>
				</i>
				<div className="title">Keep<span>+</span></div>
			</div>
			
			
			<div className="nav-container">
				<SearchBar
					setSearchContent={props.setSearchContent}
					setMainView={props.setMainView}
				/>
				<UserProfile userData={props.userData}/>
			</div>
		</nav>
	);
}

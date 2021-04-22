import React from 'react';
import SearchBar from './SearchBar';

export default function Nav(props) {
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
				<div className="user">
					{/* <img src="" alt=""/> */}
				</div>
			</div>
		</nav>
	);
}

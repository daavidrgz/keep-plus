import React, { ChangeEvent } from 'react';

interface SearchBarProps {
	setSearchContent: React.Dispatch<React.SetStateAction<string>>,
	setMainView: React.Dispatch<React.SetStateAction<{text: string, img: string}>>
}

export default function SearchBar(props: SearchBarProps) {

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if ( e.target.value === "" ) {
			props.setMainView({
				text: "All",
				img: "fi-rs-apps"
			});
			
		} else {
			props.setSearchContent(e.target.value);
			props.setMainView({
				text: "Search",
				img: "fi-rs-search"
			});
		}
	}

	return (
		<form className="search-bar" onSubmit={e => e.preventDefault()}>
			<input 
				type="text" name="keywords" className="search-bar-input" placeholder="Search for a note"
				onFocus={() => document.querySelector<HTMLElement>(".search-bar")!.style.width='calc(10vw + 120px)'}
				onBlur={() => document.querySelector<HTMLElement>(".search-bar")!.style.width='calc(5vw + 100px)'}
				onChange={handleChange}>
			</input>
			<i className="search-bar-button fi-rs-search"></i>
		</form>
	);
}

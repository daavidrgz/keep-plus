import React from 'react';

export default function SearchBar(props) {

	function handleChange(e) {
		if ( e.target.value === "" ) {
			props.setMainView("All");
			
		} else {
			props.setSearchContent(e.target.value);
			props.setMainView("Search");
		}
	}

	return (
		<form className="search-bar" onSubmit={e => e.preventDefault()}>
			<input 
				type="text" name="keywords" className="search-bar-input" placeholder="Search for a note"
				onFocus={() => document.querySelector(".search-bar").style.width='20vw'}
				onBlur={() => document.querySelector(".search-bar").style.width='12vw'}
				onChange={handleChange}>
			</input>
			<i type="submit" className="search-bar-button fi-rs-search"></i>
		</form>
	);
}

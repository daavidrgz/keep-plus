import React from 'react';
import AllNotes from './AllNotes';
import BinNotes from './BinNotes';
import SearchNotes from './SearchNotes';

export default function MainContainer(props) {
	if ( props.mainView === "All" )
		return <AllNotes showMenu={props.showMenu}/>

	else if ( props.mainView === "Bin" )
		return <BinNotes showMenu={props.showMenu}/>

	else if ( props.mainView === "Search" )
		return <SearchNotes searchContent={props.searchContent} showMenu={props.showMenu}/>
}

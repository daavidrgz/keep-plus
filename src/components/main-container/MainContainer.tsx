import React from 'react';
import AllNotes from './AllNotes';
import BinNotes from './BinNotes';
import SearchNotes from './SearchNotes';
import CategoryNotes from './CategoryNotes';

interface MainContainerProps {
	mainView: {
		text: string,
		img: string
	},
	searchContent: string,
	showMenu: boolean
}

export default function MainContainer(props: MainContainerProps) {
	if ( props.mainView.text === "All" )
		return <AllNotes showMenu={props.showMenu} />

	if ( props.mainView.text === "Bin" )
		return <BinNotes showMenu={props.showMenu} />

	if ( props.mainView.text === "Search" )
		return <SearchNotes searchContent={props.searchContent} showMenu={props.showMenu} />
	
		//Is a category
	return <CategoryNotes category={props.mainView} showMenu={props.showMenu} />
}

import React, { useState } from 'react';
import Nav from './nav/Nav';
import Menu from './menu/Menu';
import Footer from './footer/Footer';
import MainContainer from './main-container/MainContainer';
import LogIn from './auth/LogIn';
import GlobalContext from './GlobalContext'

export default function App() {
	const [userData, setUserData] = useState(null);
	const [mainView, setMainView] = useState("All");
	const [searchContent, setSearchContent] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	return (
		(!userData) ? 
		<LogIn logIn={setUserData}/> 
		:
		<div>
			<GlobalContext.Provider value={userData.email} >
				<Nav
					setMainView={setMainView}
					setSearchContent={setSearchContent}
					setShowMenu={setShowMenu}
				/>
				<Menu
					mainView={mainView}
					setMainView={setMainView}
					showMenu={showMenu}
				/>
				<MainContainer 
					userEmail={userData.email} 
					mainView={mainView} 
					searchContent={searchContent}
					showMenu={showMenu}
				/>
				<Footer
					mainView={mainView}
				/>
			</GlobalContext.Provider>
			
		</div>
	);
}

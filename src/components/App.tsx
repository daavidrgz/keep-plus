import React, { useState, useEffect } from 'react';
import Nav from './nav/Nav';
import Menu from './menu/Menu';
import Footer from './footer/Footer';
import MainContainer from './main-container/MainContainer';
import LogIn from './auth/LogIn';
import GlobalContext from './GlobalContext'

interface UserData {
	email: string,
	name: string,
	picture: string
}
interface MainView {
	text: string,
	img: string
}

export default function App() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [userFetched, setUserFetched] = useState(false);
	const [mainView, setMainView] = useState<MainView>({
		text: "All",
		img: "fi-rs-apps"
	});
	const [searchContent, setSearchContent] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		fetch("/api/get-user")
			.then(res => res.json())
			.then(data => {
				data.email === "no user" ? setUserData(null) : setUserData(data);
				setUserFetched(true);
			})
	}, []);

	return (
		( userFetched ) && (
			( !userData ) ? 
			<LogIn logIn={setUserData}/>
			:
			<div>
				<GlobalContext.Provider value={userData.email} >
					<Nav
						userData={userData}
						setMainView={setMainView}
						setSearchContent={setSearchContent}
						setShowMenu={setShowMenu}
					/>
					<Menu
						mainView={mainView}
						setMainView={setMainView}
						showMenu={showMenu}
						setShowMenu={setShowMenu}
					/>
					<MainContainer 
						mainView={mainView} 
						searchContent={searchContent}
						showMenu={showMenu}
					/>
					{/* <Footer
						mainView={mainView}
					/> */}
				</GlobalContext.Provider>
				
			</div>
		)
	);
}

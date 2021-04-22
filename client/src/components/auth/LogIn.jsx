import React, { useState } from 'react';

export default function LogInPage(props) {
	const [formInputs, setFormInputs] = useState({
		email: "",
		password: ""
	});
	const [error, setError] = useState({
		isError: false,
		errorMsg: "",
	});

	function getNotes(e) {
		e.preventDefault();
		fetch("http://localhost:3001/api/authenticate", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify(formInputs)
		})
		.then(manageResponse);
	}

	async function manageResponse(res) {
		const data = await res.json();

		if ( res.status !== 200 ) {
			if ( data === "Email not registered" )
				document.getElementById('email-input').classList.add('red-border-input');
			else if ( data === "Incorrect password" )
				document.getElementById('password-input').classList.add('red-border-input');
			
			setError({isError: true, errorMsg: data});
			
		} else
			props.logIn(data);
	}

	function handleChange(e) {
		const {name, value} = e.target;
		setFormInputs(prevValue => ({...prevValue, [name]: value}));
	}

	return (
		<div className="login-page">
			<form className="login-page-form" onSubmit={getNotes}>
				<div className="login-title">Log <span>in</span></div>

				<div className="login-field-wraper">
					<span className="login-field-title">Email:</span>
					<input className="login-input" type="email" name="email" id="email-input" onChange={handleChange} placeholder="Email"/>
					<div className="login-input-bar"></div>
				</div>
				<div className="login-field-wraper">
					<span className="login-field-title">Password:</span>
					<input className="login-input" type="password" name="password" id="password-input" onChange={handleChange} placeholder="Password"/>
					<div className="login-input-bar"></div>
				</div>
				<button className="login-btn" type="submit">Log In</button>
			</form>

			<div className={"error-message " + (error.isError ? "show-error-message" : "")}>{error.errorMsg}</div>
		</div>
	);
}

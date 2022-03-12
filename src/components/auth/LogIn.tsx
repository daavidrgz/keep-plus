import React, { useState, ChangeEvent, FormEvent } from 'react';
import googleIcon from './search.svg';

interface UserData {
	email: string,
	name: string,
	picture: string
}

export default function LogInPage(props: {logIn: (userData: UserData) => void}) {
	const [formInputs, setFormInputs] = useState({
		email: "",
		password: ""
	});
	const [error, setError] = useState({
		isError: false,
		errorMsg: "",
	});

	async function authenticate(e: FormEvent) {
		e.preventDefault();
		const res = await fetch("/api/authenticate", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify(formInputs)
		})
		const data = await res.json();

		if ( res.status === 200 ) {
			props.logIn(data);
			return;
		}

		if ( data === "Email not registered" )
			document.getElementById('email-input')!.classList.add('red-border-input');

		else if ( data === "Incorrect password" )
			document.getElementById('password-input')!.classList.add('red-border-input');
			
		setError({isError: true, errorMsg: data});
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const {name, value} = e.target;
		setFormInputs(prevValue => ({...prevValue, [name]: value}));
	}

	return (
		<div className="login-page">
			<form className="login-page-form" onSubmit={authenticate}>
				<div className="login-title">Log <span>in</span></div>

				<a className="login-google" href="/auth/google">
					<span>Log in with <span>Google</span></span>
					<img src={googleIcon} alt="Google"/>
				</a>

				<div className="login-separator">
					<div className="horizontal-rule" />
					<span>Or</span>
					<div className="horizontal-rule" />
				</div>

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

export default async function getNotes(userEmail, options) {
	const data = await fetch("http://localhost:3001/api/get-notes", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email: userEmail, ...options})
	})
	.then(res => res.json())
	
	return data;
}

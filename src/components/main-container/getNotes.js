
export default async function getNotes(userEmail, options) {
	const data = await fetch("/api/get-notes", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email: userEmail, ...options})
	}).then(res => res.json())
	
	return data;
}

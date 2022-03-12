// CSS modueles types
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'animejs';

// Note Type
type NoteData = {
	_id: string,
	title: string,
	body: string,
	date: string,
	fav: boolean,
	bin: boolean,
	category: string,
	color: string
}

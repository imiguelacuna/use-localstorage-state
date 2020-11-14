import { React, useState, useEffect } from 'react';

function useLocalState (key, initial, sync) {

	if(typeof sync === "undefined" || sync == null){
		sync = false;
	}

	const getCurrentValue = (key) => {
		const saved = window.localStorage.getItem(key);
		if (saved !== null) {
			return JSON.parse(saved);
		}
		return null;
	}

	const [synced, setSynced] = useState(false);

	const [value, setValue] = useState(() => {
		return getCurrentValue(key) || initial;
	});

	const reset = () => {
		setValue(initial);
	}

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value))
	}, [value]);

	useEffect(() => {

		const check = () => {
			if(!sync) return;
			setSynced(true);
			setValue(getCurrentValue(key));
		};

		window.addEventListener('storage', check);
		return () => {
			window.removeEventListener('storage', check);
		}
	}, []);

	return [value, setValue, reset, synced];
}

module.exports.useLocalState = useLocalState;
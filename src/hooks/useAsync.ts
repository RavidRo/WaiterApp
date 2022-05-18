import {useEffect, useRef, useState} from 'react';

export function useAsync<T extends (...args: any[]) => Promise<any>>(
	asyncFunction: T
) {
	const mounted = useRef(false);

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	const setLoadingIfMounted = (isLoading: boolean) => {
		if (mounted.current) {
			setLoading(isLoading);
		}
	};

	const [loading, setLoading] = useState(false);
	const call = (...args: Parameters<T>): ReturnType<T> => {
		setLoadingIfMounted(true);
		return asyncFunction(...args).finally(() => {
			setLoadingIfMounted(false);
		}) as ReturnType<T>;
	};

	return {call, loading};
}

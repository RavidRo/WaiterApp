export const wrapCatch = <T extends (...args: any[]) => Promise<any>>(
	f: T,
	onFail: (e: any) => void
) => {
	return (...args: Parameters<T>): ReturnType<T> => {
		return f(...args).catch(onFail) as ReturnType<T>;
	};
};

export const wrapThen = <T extends (...args: any[]) => Promise<any>>(
	f: T,
	onFail: (e: any) => void
) => {
	return (...args: Parameters<T>): ReturnType<T> => {
		return f(...args).catch(onFail) as ReturnType<T>;
	};
};

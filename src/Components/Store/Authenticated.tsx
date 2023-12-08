import { create } from 'zustand';

type CookieStateType = {
	myCookie: boolean;
	setMyCookie: (val: boolean) => void;
};
type UsernameType = {
	myName: string;
	setMyName: (val: string) => void;
};

export const cookieState = create<CookieStateType>((set) => ({
	myCookie: false,
	setMyCookie: (val) =>
		set(() => ({
			myCookie: val,
		})),
}));

export const Username = create<UsernameType>((set) => ({
	myName: '',
	setMyName: (val) =>
		set(() => ({
			myName: val,
		})),
}));

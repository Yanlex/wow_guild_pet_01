import Cookies from 'js-cookie'
import { create } from 'zustand'

export const cookieState = create((set) => ({
  myCookie: "",
  setMyCookie: (val) => set(() => ({
    myCookie: val
  }))
}))


export const Username = create((set) => ({
  myName: "",
  setMyName: (val) => set(() => ({
    myName: val
  }))
}))



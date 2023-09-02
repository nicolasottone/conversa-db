import { create } from 'zustand'

interface PopUpState {
  fileFormPopUp: boolean
  setFileFormPopUp: (value: boolean) => void
}

export const usePopUpStore = create<PopUpState>((set) => ({
  fileFormPopUp: false,
  setFileFormPopUp: (value: boolean) => set({ fileFormPopUp: value }),
}))

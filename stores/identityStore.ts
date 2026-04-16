import { create } from "zustand";

// Define the type 
type UserProfile = {
  fullName: string;
  position: string;
  religion: string;
  agency: string;
};

type UserProfileStore = {
  profile: UserProfile;

  // actions
  setField: (field: keyof UserProfile, value: string) => void;
  setProfile: (data: UserProfile) => void;
  resetProfile: () => void;
};

// initial state
const initialProfile: UserProfile = {
  fullName: "",
  position: "",
  religion: "",
  agency: "",
};

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  profile: initialProfile,

  setField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),

  setProfile: (data) => set({ profile: data }),

  resetProfile: () => set({ profile: initialProfile }),
}));
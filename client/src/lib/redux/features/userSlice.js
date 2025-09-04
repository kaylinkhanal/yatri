import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userDetails: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserDetails: (state, actions) => {
      state.userDetails = actions.payload
    },
    logoutUser: (state) => {
      state.userDetails = {}
    },

  },
})

export const { addUserDetails, logoutUser } = userSlice.actions

export default userSlice.reducer
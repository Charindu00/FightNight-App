import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favourites: [], // Array of fight objects
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    // Add a fight to favourites
    addFavourite: (state, action) => {
      const fight = action.payload;
      // Check if fight already exists (prevent duplicates)
      const exists = state.favourites.find(item => item.id === fight.id);
      if (!exists) {
        state.favourites.push(fight);
      }
    },
    
    // Remove a fight from favourites
    removeFavourite: (state, action) => {
      const fightId = action.payload;
      state.favourites = state.favourites.filter(item => item.id !== fightId);
    },
    
    // Toggle favourite - smart add/remove
    toggleFavourite: (state, action) => {
      const fight = action.payload;
      const existingIndex = state.favourites.findIndex(item => item.id === fight.id);
      
      if (existingIndex >= 0) {
        // Already exists - remove it
        state.favourites.splice(existingIndex, 1);
      } else {
        // Doesn't exist - add it
        state.favourites.push(fight);
      }
    },
    
    // Clear all favourites (optional - for logout or reset)
    clearFavourites: (state) => {
      state.favourites = [];
    },
  },
});

// Export actions
export const { 
  addFavourite, 
  removeFavourite, 
  toggleFavourite, 
  clearFavourites 
} = favouritesSlice.actions;

// Selectors
export const selectFavourites = (state) => state.favourites.favourites;
export const selectIsFavourite = (fightId) => (state) => {
  return state.favourites.favourites.some(item => item.id === fightId);
};
export const selectFavouritesCount = (state) => state.favourites.favourites.length;

// Export reducer
export default favouritesSlice.reducer;

import { showErrorToast } from "@/components/common/ToastProvider";
import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk, registerUserThunk } from "./AuthThunks";
import { User } from "@/types/Auth.types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },

    setUserData(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // LOGIN THUNK
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        if (action.payload.accessToken) {
          localStorage.setItem("token", action.payload.accessToken);
          window.location.href = "/";
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Login failed.";
        showErrorToast(typeof action.payload === "string" ? action.payload : "Login failed.");
      });

    // REGISTER THUNK
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        window.location.href = "/signin";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Registration failed.";

        showErrorToast(
          typeof action.payload === "string" ? action.payload : "Registration failed."
        );
      });
  },
});

const authReducer = authSlice.reducer;
export const { logout, setUserData } = authSlice.actions;
export { authReducer };

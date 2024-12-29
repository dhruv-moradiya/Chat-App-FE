import { showErrorToast } from "@/components/common/ToastProvider";
import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk, registerUserThunk } from "./AuthThunks";

interface AuthState {
  isAuthenticated: boolean;

  user: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    isUserLoggedIn(state, action) {
      if (action.payload.token) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      } else {
        state.isAuthenticated = false;
        state.user = action.payload.user;
      }
      state.isLoading = false;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
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
        state.user = action.payload;

        if (action.payload.accessToken) {
          localStorage.setItem("token", action.payload.accessToken);
          window.location.href = "/";
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string" ? action.payload : "Login failed.";
        showErrorToast(
          typeof action.payload === "string" ? action.payload : "Login failed."
        );
      });

    // REGISTER THUNK
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        window.location.href = "/signin";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Registration failed.";

        showErrorToast(
          typeof action.payload === "string"
            ? action.payload
            : "Registration failed."
        );
      });
  },
});

const authReducer = authSlice.reducer;
export const { logout, isUserLoggedIn } = authSlice.actions;
export { authReducer };

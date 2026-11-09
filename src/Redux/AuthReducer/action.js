import {
  AUTH_ERROR, AUTH_LOADING, AUTH_SUCCESS, AUTH_LOGOUT,
} from "./actionTypes";
import { signOut } from "firebase/auth";
import { authentication } from "../../Utils/Firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const USER_API = "/api/users";

// ── Email Login ──────────────────────────────────────────────────────────────
export const loginWithEmail = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const res = await fetch(`${USER_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const message = await res.text();
      dispatch({ type: AUTH_ERROR, payload: message || "Invalid credentials." });
      return false;
    }
    const user = await res.json();
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: `user_${user.id}`,
        user: { uid: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role },
      },
    });
    return true;
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: "Unable to reach authentication service." });
    return false;
  }
};

// ── Email Register ───────────────────────────────────────────────────────────
export const registerWithEmail = (name, email, mobile, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const res = await fetch(`${USER_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mobile, password }),
    });
    if (!res.ok) {
      const message = await res.text();
      dispatch({ type: AUTH_ERROR, payload: message || "Registration failed." });
      return false;
    }
    const user = await res.json();
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: `user_${user.id}`,
        user: { uid: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role },
      },
    });
    return true;
  } catch (err) {
    dispatch({ type: AUTH_ERROR, payload: "Unable to reach authentication service." });
    return false;
  }
};

// ── Phone OTP (real Firebase) ────────────────────────────────────────────────
export const setupRecaptcha = (elementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      elementId,
      { size: "invisible" },
      authentication
    );
  }
};

export const sendPhoneOTP = (phone) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    setupRecaptcha("recaptcha-container");
    const result = await signInWithPhoneNumber(authentication, phone, window.recaptchaVerifier);
    window.confirmationResult = result;
    dispatch({ type: "OTP_SENT" }); // just clear loading
    return true;
  } catch (err) {
    window.recaptchaVerifier = null;
    dispatch({ type: AUTH_ERROR, payload: "Failed to send OTP. Use +91XXXXXXXXXX format." });
    return false;
  }
};

export const verifyOTP = (otp) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user   = result.user;
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        token: user.uid,
        user:  { uid: user.uid, name: user.displayName || "User", phone: user.phoneNumber, avatar: null },
      },
    });
    return true;
  } catch {
    dispatch({ type: AUTH_ERROR, payload: "Invalid OTP. Please try again." });
    return false;
  }
};

// ── Logout ───────────────────────────────────────────────────────────────────
export const logout = () => async (dispatch) => {
  try { await signOut(authentication); } catch (_) {}
  dispatch({ type: AUTH_LOGOUT });
};

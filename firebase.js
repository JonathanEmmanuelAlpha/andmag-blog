import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { v4 } from "uuid";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

export const AppCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.reCaptchatSiteKey),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);

export default app;

export const adminsCollection = collection(database, "admins");
export const profilesCollection = collection(database, "profiles");
export const blogsCollection = collection(database, "blogs");
export const articlesCollection = collection(database, "articles");
export const trainningsCollection = collection(database, "trainnings");
export const faqsCollection = collection(database, "faqs");

export const AUTH_ERRORS = {
  "auth/wrong-password": "Wrong password. Please verify your password",
  "auth/invalid-email": "Invalid email. Please enter a correct email",
  "auth/email-already-in-use": "Email already in use",
  "auth/email-already-exists":
    "The provided email is already in use by an existing user. Each user must have a unique email.",
  "auth/internal-error":
    "The Authentication server encountered an unexpected error while trying to process the request.",
  "auth/invalid-display-name":
    "The provided value for the displayName user property is invalid. It must be a non-empty string.",
  "auth/invalid-dynamic-link-domain":
    "The provided dynamic link domain is not configured or authorized for the current project.",
  "auth/invalid-email":
    "The provided value for the email user property is invalid. It must be a string email address.",
  "auth/invalid-password":
    "The provided value for the password user property is invalid. It must be a string with at least six characters.",
  "auth/invalid-photo-url":
    "The provided value for the photoURL user property is invalid. It must be a string URL.",
  "auth/network-request-failed":
    "Network request failed. Please verify your internet connection.",
};
export function handleAuthErrors(error) {
  switch (error.code) {
    case "auth/wrong-password":
      return AUTH_ERRORS["auth/wrong-password"];
    case "auth/email-already-exists":
      return AUTH_ERRORS["auth/email-already-exists"];
    case "auth/email-already-in-use":
      return AUTH_ERRORS["auth/email-already-in-use"];
    case "auth/internal-error":
      return AUTH_ERRORS["auth/internal-error"];
    case "auth/invalid-display-name":
      return AUTH_ERRORS["auth/invalid-display-name"];
    case "auth/invalid-dynamic-link-domain":
      return AUTH_ERRORS["auth/invalid-dynamic-link-domain"];
    case "auth/invalid-email":
      return AUTH_ERRORS["auth/invalid-email"];
    case "auth/invalid-password":
      return AUTH_ERRORS["auth/invalid-password"];
    case "auth/invalid-photo-url":
      return AUTH_ERRORS["auth/invalid-photo-url"];
    case "auth/network-request-failed":
      return AUTH_ERRORS["auth/network-request-failed"];

    default:
      return "Unknown error. Please try again.";
  }
}

export const FIRESTORE_ERRORS = {
  aborted: "The operation was aborted.",
  "already-exist": "The data that you attempted to create already exists.",
  cancelled: "The operation was cancelled.",
  "data-loss": "Unrecoverable data loss or corruption.",
  "deadline-exceeded": "Deadline expired before operation could complete.",
  internal: "Internal server errors.",
  "ivalid-argument": "User specified an invalid argument.",
  "not-found": "Some requested data was not found.",
  "out-of-range": "Operation was attempted past the valid range.",
  "permission-denied":
    "User does not have permission to execute the specified operation.",
  unauthenticated:
    "User does not have valid authentication credentials for the operation. Please login and try again",
  unavailable: "The service is currently unavailable.",
  unimplemented: "Operation is not implemented or not supported/enabled.",
  unknown: "Unknown error or an error from a different error domain.",
  "network-request-failed":
    "Network request failed. Please verify your internet connection.",
};
export function handleFirestoreErrors(error) {
  switch (error.code) {
    case "aborted":
      return FIRESTORE_ERRORS.aborted;
    case "already-exist":
      return FIRESTORE_ERRORS["already-exist"];
    case "cancelled":
      return FIRESTORE_ERRORS.cancelled;
    case "data-loss":
      return FIRESTORE_ERRORS["data-loss"];
    case "deadline-exceeded":
      return FIRESTORE_ERRORS["deadline-exceeded"];
    case "internal":
      return FIRESTORE_ERRORS.internal;
    case "ivalid-argument":
      return FIRESTORE_ERRORS["ivalid-argument"];
    case "network-request-failed":
      return FIRESTORE_ERRORS["network-request-failed"];
    case "not-found":
      return FIRESTORE_ERRORS["not-found"];
    case "out-of-range":
      return FIRESTORE_ERRORS["out-of-range"];
    case "permission-denied":
      return FIRESTORE_ERRORS["permission-denied"];
    case "unauthenticated":
      return FIRESTORE_ERRORS.unauthenticated;
    case "unavailable":
      return FIRESTORE_ERRORS.unavailable;
    case "unimplemented":
      return FIRESTORE_ERRORS.unimplemented;
    case "unknown":
      return FIRESTORE_ERRORS.unknown;

    default:
      return "Unknown error. Please try again.";
  }
}

export const STORAGE_ERRORS = {
  "storage/unknown": "An unknown error occurred.",
  "storage/unauthenticated":
    "User is unauthenticated, please login and try again.",
  "storage/unauthorized":
    "User is not authorized to perform the desired action.",
  "storage/retry-limit-exceeded":
    "The maximum time limit on an operation has been excceded. Try uploading again.",
  "storage/canceled": "User canceled the operation.",
  "storage/network-request-failed":
    "Network request failed. Please verify your internet connection.",
};
export function handleStorageErrors(error) {
  switch (error.code) {
    case "storage/canceled":
      return STORAGE_ERRORS["storage/canceled"];
    case "storage/network-request-failed":
      return STORAGE_ERRORS["storage/network-request-failed"];
    case "storage/retry-limit-exceeded":
      return STORAGE_ERRORS["storage/retry-limit-exceeded"];
    case "storage/unauthenticated":
      return STORAGE_ERRORS["storage/unauthenticated"];
    case "storage/unauthorized":
      return STORAGE_ERRORS["storage/unauthorized"];
    case "storage/unknown":
      return STORAGE_ERRORS["storage/unknown"];

    default:
      return "Unknown error. Please try again.";
  }
}

/**
 * @param {String} destination
 * @param {Blob} file
 */
export const fileUpload = async function (
  destination,
  file,
  owner = null,
  admin = null
) {
  if (!(file instanceof Blob)) return null;

  const fileRef = ref(storage, destination);
  try {
    const snap = await uploadBytes(fileRef, file, {
      customMetadata: { owner: owner, admin: admin },
    });
    return await getDownloadURL(snap.ref);
  } catch (error) {}
};

/**
 * @param {String} targetFolder
 * @param {Blob[]} files
 * @param {String[]} filesName
 */
export const multiFileUpload = async function (
  targetFolder,
  files,
  filesName = null,
  owner = null,
  admin = null
) {
  if (!files) return null;

  const images = Array.from(files);
  if (!images) return null;

  const promises = images.map((file, index) => {
    let fileName =
      filesName instanceof Array && typeof filesName[index] === "string"
        ? filesName[index]
        : v4();
    return uploadBytes(ref(storage, `${targetFolder}/${fileName}`), file, {
      customMetadata: {
        owner: owner,
        admin: admin,
      },
    }).then(async (snap) => {
      return {
        fileName,
        downloadURL: await getDownloadURL(snap.ref),
      };
    });
  });

  return Promise.all(promises);
};

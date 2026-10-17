export const messages = {
  common: {
    appName: "Dompet Digital Dollar",
    loading: "Loading...",
    tryAgain: "Try again",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    viewDetails: "View details",
    comingSoon: "Coming soon",
    actions: {
      submit: "Submit",
      continue: "Continue",
      close: "Close",
    },
  },
  errors: {
    genericTitle: "Something went wrong",
    genericDescription: "An unexpected error occurred. Please check your connection and try again.",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you are looking for does not exist or has been moved.",
    unauthorized: "You must be signed in to access this page.",
    forbidden: "You do not have permission to view this resource.",
  },
  emptyStates: {
    noDataTitle: "No records found",
    noDataDescription: "There is no information to display at this time.",
    noTransactionsTitle: "No transactions yet",
    noTransactionsDescription: "Top up your balance or receive payments to get started with your USD wallet.",
  },
  wallet: {
    title: "Wallet Overview",
    currentBalance: "Current Balance",
    balanceHidden: "••••••",
    actions: {
      topUp: "Top Up",
      requestCard: "Request Card",
      receive: "Receive Payment",
      history: "History",
    },
  },
  kyc: {
    status: {
      notVerified: "Not Verified",
      inReview: "In Review",
      approved: "Approved",
      rejected: "Rejected",
      reuploadRequired: "Re-upload Required",
    },
    banner: {
      title: "Verify your identity to unlock all wallet features",
      description: "Upload a clear photo of your Indonesian National ID (KTP) to start topping up and requesting a virtual debit card.",
      cta: "Verify Identity",
    },
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    emailLabel: "Email address",
    passwordLabel: "Password",
  },
} as const;

export type Messages = typeof messages;

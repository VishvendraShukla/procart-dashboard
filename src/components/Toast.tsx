import { toast } from "react-hot-toast";

export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "green",
      color: "white",
    },
  });
};

export const showErrorToast = (message: string): void => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "red",
      color: "white",
    },
  });
};

export const showInfoToast = (message: string): void => {
  toast(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "blue",
      color: "white",
    },
  });
};

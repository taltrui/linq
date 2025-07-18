import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
};

export const toastError = (message: string) => {
    sonnerToast.error(message, {
        duration: 5000,
        position: 'top-center',
    });
};

export const toastSuccess = (message: string) => {
    sonnerToast.success(message, {
        duration: 3000,
        position: 'top-center',
    });
};
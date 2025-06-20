import { toast } from "sonner";

export const toastError = (message: string) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-center',
    });
};

export const toastSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-center',
    });
};
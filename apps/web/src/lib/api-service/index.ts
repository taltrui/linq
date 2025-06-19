import { authService } from "./auth";
import { companiesService } from "./companies";


export const apiService = {
    auth: authService,
    companies: companiesService,
};
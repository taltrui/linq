import { authService } from "./auth";
import { companiesService } from "./companies";
import { usersService } from "./users";

export const apiService = {
    auth: authService,
    companies: companiesService,
    users: usersService,
};
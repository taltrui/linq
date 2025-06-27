import { authService } from "./auth";
import { companiesService } from "./companies";
import { usersService } from "./users";
import { clientsService } from "./clients";
import { jobsService } from "./jobs";
import { quotationsService } from "./quotations";

export const apiService = {
    auth: authService,
    companies: companiesService,
    users: usersService,
    clients: clientsService,
    jobs: jobsService,
    quotations: quotationsService,
};
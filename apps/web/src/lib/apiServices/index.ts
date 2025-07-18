import { authService } from "./auth";
import { companiesService } from "./companies";
import { usersService } from "./users";
import { clientsService } from "./clients";
import { jobsService } from "./jobs";
import { quotationsService } from "./quotations";
import { inventoryService } from "./inventory";
import { suppliersService } from "./suppliers";
import { quotationMaterialsService } from "./quotationMaterials";

export const apiService = {
    auth: authService,
    companies: companiesService,
    users: usersService,
    clients: clientsService,
    jobs: jobsService,
    quotations: quotationsService,
    inventory: inventoryService,
    suppliers: suppliersService,
    quotationMaterials: quotationMaterialsService,
};
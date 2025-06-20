import { authContract } from './auth';
import { companiesContract } from './companies';
import { usersContract } from './users';
import { clientsContract } from './clients';
import { jobsContract } from './jobs';

export * from './agendas';
export * from './auth';
export * from './companies';
export * from './users';
export * from './clients';
export * from './jobs';

export const apiContract = {
    auth: authContract,
    companies: companiesContract,
    users: usersContract,
    clients: clientsContract,
    jobs: jobsContract,
};
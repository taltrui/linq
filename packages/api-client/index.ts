import { authContract } from './auth';
import { companiesContract } from './companies';
import { usersContract } from './users';

export * from './agendas';
export * from './auth';
export * from './companies';
export * from './users';


export const apiContract = {
    auth: authContract,
    companies: companiesContract,
    users: usersContract,
};
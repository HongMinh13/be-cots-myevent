import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

export type CustomerAttrs = Partial<
  Pick<Customer, 'name' | 'address' | 'phoneNumber'>
>;

export class CustomerRepository extends Repository<Customer> {
  public async saveCustomer(
    customer: CustomerAttrs,
    trx = this.manager,
  ): Promise<Customer> {
    return await trx.save(Customer, customer);
  }
}

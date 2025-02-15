import { Brackets, SelectQueryBuilder, getRepository } from 'typeorm';
import { FilterDto, QueryFilterDto } from '../dtos/queryFilter';
import { BadRequestException } from '@nestjs/common';
import _, { forEach, isBoolean, isEmpty, isNumber } from 'lodash';
import { capitalizeFirstLetter } from '@/providers/words';
import { CustomBaseEntity } from './baseEntity';
import { GraphQLResolveInfo } from 'graphql';

export const getPaginationResponse = async (
  builder: SelectQueryBuilder<any>,
  queryParams: QueryFilterDto,
) => {
  const { limit, page, orderBy } = queryParams;
  const offset = (page - 1) * limit;

  if (orderBy) {
    addOrderByQuery(builder, orderBy);
  }

  builder.skip(offset).take(limit);

  const [items, count] = await builder.getManyAndCount();

  const meta = {
    totalItems: count,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };

  return { items, meta };
};

export const addOrderByQuery = (
  builder: SelectQueryBuilder<any>,
  orderBy: string,
) => {
  const field = orderBy.split(':')[0];
  const sortBy = orderBy.split(':')[1].toUpperCase() as 'DESC' | 'ASC';
  const nulls = String(orderBy.split(':')[2])
    .replace('_', ' ')
    .toUpperCase() as 'NULLS FIRST' | 'NULLS LAST';

  if (['ASC', 'DESC'].includes(sortBy)) {
    if (['NULLS FIRST', 'NULLS LAST'].includes(nulls)) {
      builder.orderBy(`${field}`, sortBy, nulls);

      return builder;
    }

    builder.orderBy(`${field}`, sortBy);
  }

  return builder;
};

export const filterBuilder = (
  builder: SelectQueryBuilder<any>,
  filters: FilterDto[],
): any => {
  if (filters) {
    filters.forEach((filter, index) => {
      let getNamingTableName;
      const { field: fieldName, data, operator } = filter;

      let field: any[] = fieldName.split('.');

      if (field.length > 2) {
        throw new BadRequestException('No support now');
      }
      if (field.length === 2) {
        getNamingTableName = field[0];
      }
      field = field[field.length - 1];

      if (
        (!isNumber(data) && !isBoolean(data) && isEmpty(data)) ||
        data === ' '
      ) {
        return;
      }
      if (operator === 'in') {
        const key = `in${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" IN (:...${key})`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'nin') {
        const key = `nin${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" NOT IN (:...${key})`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'eq') {
        const key = `eq${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" = :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'neq') {
        const key = `neq${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" != :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'lt') {
        const key = `lt${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" < :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'lte') {
        const key = `lte${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" <= :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'gt') {
        const key = `gt${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" > :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'gte') {
        const key = `gte${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(`"${getNamingTableName}"."${field}" >= :${key}`, {
              [key]: data,
            });
          }),
        );
      }
      if (operator === 'like') {
        const key = `like${index}`;
        builder.andWhere(
          new Brackets((qb) => {
            qb.where(
              `unaccent("${getNamingTableName}"."${field}") ilike unaccent(:${key})`,
              {
                [key]: `%${data}%`,
              },
            );
          }),
        );
      }
    });
  }

  return builder;
};

const joinBuilder = (
  tableAlias: string,
  queryBuilder: SelectQueryBuilder<any>,
  relations: string[],
): any => {
  forEach(relations, (expression) => {
    if (expression && expression.split('.').length > 1) {
      //Expression: sender.country
      //EntityName: Country
      //Alias: Sender.Country => for filter ex: Sender.Country.name, Receiver.Country.name, ....
      const entityName = capitalizeFirstLetter(expression.split('.')[1]);
      const alias = `${capitalizeFirstLetter(
        expression.split('.')[0],
      )}.${entityName}`;
      expression = capitalizeFirstLetter(expression);
      queryBuilder.leftJoinAndSelect(expression, alias);
    } else {
      const entityName = capitalizeFirstLetter(expression);
      queryBuilder.leftJoinAndSelect(
        `${tableAlias}.${expression}`,
        capitalizeFirstLetter(entityName),
      );
      expression = capitalizeFirstLetter(expression);
    }
  });
  return queryBuilder;
};

export const createFilterQueryBuilder = (
  entity: typeof CustomBaseEntity,
  queryParams: QueryFilterDto,
  info?: GraphQLResolveInfo,
): SelectQueryBuilder<any> => {
  const relations = info ? entity.getRelations(info, true) : [];

  const builder = getRepository(entity).createQueryBuilder(entity.name) as any;

  if (relations?.length) {
    joinBuilder(entity.name, builder, relations);
  }

  if (queryParams.filters) {
    filterBuilder(builder, queryParams.filters);
  }

  return builder;
};

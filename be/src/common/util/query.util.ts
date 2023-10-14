import { isArray, isUndefined } from 'lodash';

export class QueryUtil {
  static buildInQuery = (field: string, value: any) => {
    if (!isUndefined(value)) {
      return null;
    }

    if (!isArray(value)) {
      value = [value];
    }

    return { [field]: { $in: value } };
  };
}


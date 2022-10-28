import moment from 'moment';
import { Ellipsis } from '@suze/components';
import { isNumber, isString, isArray, isNill, isObject } from '@suze/utils';

import type { EllipsisProps } from '@suze/components/es/ellipsis';
import { DATE_FORMAT, DATETIME_FORMAT, DEFAULT_SEPARATOR, TIME_FORMAT } from '@/constants';

const isValid = (date) => Boolean(date) && (isNumber(date) || isString(date));

// 格式化duration为指定模式
export function duration(value: moment.MomentInput, format: string = TIME_FORMAT): string {
  if (isNill(value)) return '';

  return moment.utc(value).format(format);
}

export function renderLabel(id, map: any[] = []) {
  const { color, label, icon } = map.find(({ value }) => value === id) || {};
  const props = color ? { style: { color } } : {};
  const iconNode = icon || '';

  return (
    <span {...props}>
      {iconNode} {label}
    </span>
  );
}

const getParsedDate =
  (defaultFormat) =>
  ({ value, format }) => {
    let momentValue;
    if (moment.isMoment(value)) {
      momentValue = value;
    } else if (isValid(value)) {
      momentValue = moment(value);
    } else {
      return '';
    }
    return momentValue.format(format ?? defaultFormat);
  };

const dateFormatParse = getParsedDate(DATE_FORMAT);
// const monthFormatParse = getParsedDate(MONTH_FORMAT);
const datetimeFormatParse = getParsedDate(DATETIME_FORMAT);

const getRangeParseData =
  (formatParse, separator = ' - ') =>
  ({ value, format }) => {
    if (!isArray(value)) {
      return '';
    }
    const formatFn = format ? getParsedDate(format) : formatParse;
    return [formatFn({ value: value[0] }), formatFn({ value: value[1] })].join(separator);
  };

function renderTextarea({ value = '' }: { value: string }): React.ReactNode {
  return <pre style={{ marginBottom: 0, whiteSpace: 'break-spaces' }}>{value}</pre>;
}

function renderNumber<R>({ value }: { value: R }): R {
  return value;
}

function renderBoolean({ value }: { value: string | boolean }): string {
  return value === 'true' || value === true ? '是' : '否';
}

function renderEllipsis({ value, ...rest }: EllipsisProps & { value: React.ReactChild }): React.ReactNode {
  return <Ellipsis {...rest}>{value}</Ellipsis>;
}

function renderTime({ value, format }: { value: moment.MomentInput; format: string }): string {
  return duration(value, format);
}

function renderRadioGroup({ value, options }: { value: any; options: any[] }): React.ReactNode {
  return renderLabel(value, options);
}

function renderEnums({ value, enums }: { value: any; enums: any }): string {
  const values = isArray(value) ? value : [value];
  const result: string[] = [];

  values.forEach((value) => {
    let enumValue;
    if (isNill(value)) {
      enumValue = '';
    } else if (isObject(enums)) {
      enumValue = enums[value];
    } else if (isArray(enums)) {
      const { color, label } = enums.find((x) => x.value === value) || {};

      enumValue = label || value;

      if (color) {
        enumValue = <span style={{ color }}>{enumValue}</span>;
      }
    }

    result.push(enumValue);
  });

  return result.join(DEFAULT_SEPARATOR);
}

function renderCheckboxGroup({ value, options }: { value: any; options: any }): string {
  return renderEnums({ value, enums: options });
}

function renderText({ value, defaultValue, ...rest }: { value: string; defaultValue?: string }): React.ReactNode {
  return <span {...rest}>{value ?? defaultValue}</span>;
}
export default {
  text: renderText,
  textarea: renderTextarea,
  number: renderNumber,
  boolean: renderBoolean,
  ellipsis: renderEllipsis,
  // time可能是一个数字，所以不能通过moment解析【默认解析为当前时区的时间】，而需要moment.utc【解析为标准UTC时间】
  time: renderTime,
  date: dateFormatParse,
  datetime: datetimeFormatParse,
  'positive-integer': renderNumber,
  'date-range': getRangeParseData(dateFormatParse),
  'datetime-range': getRangeParseData(datetimeFormatParse),
  'radio-group': renderRadioGroup,
  // 重写kant的enums，用以支持value为数组的情况
  enums: renderEnums,
  'checkbox-group': renderCheckboxGroup,
};

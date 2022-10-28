import moment from 'moment';
import { Select, Checkbox, InputNumber, Radio, Switch, TimePicker as AntdTimePicker } from 'antd';
import { Input, Select as KSelect, DatePicker } from '@suze/components';
import { UploadImg } from '@/components';
import { DatePickerProps } from '@suze/components/es/date-picker'

import type { RangePickerProps } from 'antd/es/date-picker';
import { isEmpty, isNill, isArray, isObject} from '@suze/utils';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from '@/constants';
import React from 'react';

const { TimePicker, RangePicker } = DatePicker;
const { TextArea } = Input;
const { Group: CheckboxGroup } = Checkbox;
const { Group: RadioGroup } = Radio;

const RangePickerNode: any = RangePicker;

// 转换为moment时间
export function toMoment(value: moment.MomentInput, type = 'utc+8'): moment.Moment | undefined {
  let momentValue;

  const isMoment = moment.isMoment(value);

  // 忽略[]或{}的情况
  if (!value && isEmpty(value)) return undefined;

  if (isMoment) {
    momentValue = value;
  } else if (type === 'utc+8') {
    momentValue = moment(value);
  } else if (type === 'utc') {
    momentValue = moment.utc(value);
  }

  return momentValue.isValid() ? momentValue : undefined;
}

// 时间只取时分秒的时长
export function diffMoment(value: moment.MomentInput): number | moment.MomentInput {
  return moment.isMoment(value) ? value.startOf('s').diff(value.clone().startOf('d')) : value;
}

export function valueOfMoment(value: moment.MomentInput): number | moment.MomentInput {
  return moment.isMoment(value) ? value.unix() * 1000 : value;
}

function renderText({ value, defaultValue, ...rest }: { value: string; defaultValue?: string }): React.ReactNode {
  return <span {...rest}>{value ?? defaultValue}</span>;
}

function renderEnums({ enums, ...rest }: Parameters<typeof KSelect>[0] & { enums: any[] }): React.ReactNode {
  let options = enums;

  if (enums && !Array.isArray(enums)) {
    options = Object.keys(enums).reduce((arr, key) => [...arr, { value: key, label: enums[key] }], [] as any[]);
  }

  const selectProps = {
    allowClear: true,
    optionFilterProp: 'label',
    showArrow: true,
    options,
    ...rest,
  };

  return <KSelect {...selectProps} />;
}

// 动作库有个 ACTION_SCOPE 枚举，里面的可选状态是互斥（mutex）的，选了挑战就不能选其他，KSelect只支持options传值，而options不支持设置单项的disabled
function renderMutexEnums({ enums, ...rest }: Parameters<typeof KSelect>[0] & { enums: any[] }): React.ReactNode {
  const selectProps = {
    allowClear: true,
    optionFilterProp: 'label',
    ...rest,
  };

  return (
    <Select {...selectProps}>
      {enums.map((item) => (
        <Select.Option key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

function renderTextarea({ resize, ...rest }: Parameters<typeof TextArea>[0] & { resize: boolean }): React.ReactNode {
  const textareaProps = { rows: 3, ...rest };

  if (!resize) {
    textareaProps.style = { ...rest.style, resize: 'none' };
  }

  return <TextArea {...textareaProps} />;
}

type CheckboxProps = Parameters<typeof Checkbox>[0];
type BooleanProps = Omit<CheckboxProps, 'value' | 'onChange'> & {
  value: boolean;
  onChange: (boolean) => void;
};
function renderBoolean({ value, onChange, ...rest }: BooleanProps): React.ReactNode {
  const onResetChange = (event) => {
    onChange(event.target.checked);
  };

  return <Checkbox checked={value} onChange={onResetChange} {...rest} />;
}

type RenderSwitchProps = Omit<Parameters<typeof Switch>[0], 'checked'> & { value: boolean };
function renderSwitch({ value, ...rest }: RenderSwitchProps): React.ReactNode {
  return <Switch checked={value} {...rest} />;
}

type ReplaceProps<T, U> = T & Omit<U, keyof T>;

interface RenderPickerProps {
  value: moment.MomentInput;
  onChange(changeData: moment.MomentInput): any;
}

type TimePickerProps = Parameters<typeof TimePicker>[0];

function renderTime({ value, onChange, ...props }: ReplaceProps<RenderPickerProps, TimePickerProps>): React.ReactNode {
  const timePickerProps = {
    style: { width: '100%' },
    value: toMoment(value, 'utc'),
    showNow: false,
    onChange: (newValue) => onChange(diffMoment(newValue)),
    immediately: true,
    ...props,
  };

  return <TimePicker {...timePickerProps} />;
}

function renderDate(props: DatePickerProps): React.ReactNode {
  return <DatePicker {...props} />;
}

function renderDateTime({
  value,
  onChange,
  ...props
}: ReplaceProps<RenderPickerProps, DatePickerProps>): React.ReactNode {
  const datePickerProps: DatePickerProps = {
    style: { width: '100%' },
    value: toMoment(value),
    format: DATETIME_FORMAT,
    showNow: false,
    showTime: true,
    onChange: (newValue) => onChange(valueOfMoment(newValue)),
    ...props,
  };
  return <DatePicker immediately {...datePickerProps} />;
}

function renderDateRange({ format = DATE_FORMAT, ...props }: RangePickerProps): React.ReactNode {
  const rangePickerProps = {
    style: { width: '100%' },
    format,
    ...props,
  };

  return <RangePickerNode {...rangePickerProps} />;
}
function renderTimeRange({ ...props }: RangePickerProps): React.ReactNode {
  const rangePickerProps = {
    style: { width: '100%' },
    ...props,
  };

  return <AntdTimePicker.RangePicker {...rangePickerProps} />;
}

interface RenderRangeProps {
  format: string;
  defaultValue: moment.Moment[];
}

function renderDateTimeRange({
  format = DATETIME_FORMAT,
  value,
  defaultValue = [moment('00:00:00', TIME_FORMAT), moment('23:59:59', TIME_FORMAT)],
  placeholder,
  ...props
}: ReplaceProps<RenderRangeProps, RangePickerProps>): React.ReactNode {
  const timeFormat = format.split(' ')[1];
  const formatTime = (time) => {
    return isNill(time) ? undefined : moment(time);
  };
  const rangePickerProps = {
    showTime: {
      format: timeFormat,
      defaultValue,
    },
    format,
    // 某些特殊场景，比如list-content组件缓存查询字段时时间被存为字符串模式，所以需要做一下兼容
    value: value ? [formatTime(value[0]), formatTime(value[1])] : value,
    ...props,
  };
  return <RangePickerNode placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} {...rangePickerProps} />;
}

function transformUploadInputValue(value) {
  if (!value) return value;
  const result = isArray(value) ? value : [value];

  return result.filter(Boolean).map((url, index) =>
    isObject(url)
      ? url
      : {
        name: url,
        url,
        status: 'done',
        uid: (index + 1) * -1,
      },
  );
}

function renderPositiveInteger(props: Parameters<typeof InputNumber>[0]): React.ReactNode {
  const inputNumberProps = {
    min: 1,
    max: Infinity,
    parser: (value) => value.replace(/\D.*$/, ''),
    ...props,
  };
  return <InputNumber {...inputNumberProps} />;
}

function renderUpload({ value, ...rest }): React.ReactNode {
  return <UploadImg value={transformUploadInputValue(value)} {...rest} />;
}

export default {
  text: renderText,
  enums: renderEnums,
  'mutex-enums': renderMutexEnums,
  textarea: renderTextarea,
  boolean: renderBoolean,
  switch: renderSwitch,
  time: renderTime,
  date: renderDate,
  datetime: renderDateTime,
  'date-range': renderDateRange,
  'time-range': renderTimeRange,
  'datetime-range': renderDateTimeRange,
  number: InputNumber,
  // 'number-range': NumberRange,
  'positive-integer': renderPositiveInteger,
  'checkbox-group': CheckboxGroup,
  'radio-group': RadioGroup,
  upload: renderUpload,
};

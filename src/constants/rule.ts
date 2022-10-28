import { isNill, isObject, isArray } from '@suze/utils';
import { sumBy } from 'lodash';
import Regex from './regex';

function compile(message, ...args) {
  return message.replace(/\$(\d)/g, (value, index) => {
    const arg = args[index - 1];
    return isNill(arg) ? '' : arg;
  });
}

function validate(checkFn, message) {
  return {
    validator: (rule, value) => {
      const msg = !isNill(value) ? message : '';
      if (!checkFn(value, rule)) {
        return Promise.reject(new Error(msg));
      } else {
        return Promise.resolve();
      }
    },
  };
}

function required(message, isRequired = true) {
  return { required: isRequired, message };
}

function inRange(start, end, message = '请输入$1-$2之间的数值') {
  return validate((value) => value >= start && value <= end, compile(message, start, end));
}

function greaterThan(min, message = '请输入大于$1的数值') {
  return validate((value) => value > min, compile(message, min));
}

function lessThan(max, message = '请输入小于$1的数值') {
  return validate((value) => value < max, compile(message, max));
}

function includes(substr, message = '请输入包含$1关键字的字符') {
  return validate((value) => value.includes(substr), compile(message, substr));
}

function maxLength(len, message = '请不要超出$1个字符') {
  return validate((value = '') => value.length <= len, compile(message, len));
}

function maxSpecifiedCharLength(maxLen: number, message = '输入限制为$1个中文、$2个英文字母或特殊字符') {
  return validate((value = '') => {
    // 中文使用 CJK 字符集
    // https://unicode-table.com/cn/blocks/cjk-unified-ideographs/
    // https://unicode.org/charts/PDF/U4E00.pdf
    const getCharLength = (char: string) => (/[\u4E00-\u9FFF]/.test(char) ? 2 : 1);
    const length = sumBy(value, getCharLength);
    return length <= maxLen;
  }, compile(message, Math.ceil(maxLen / 2), maxLen));
}

function minLength(len, message = '请至少输入$1字符') {
  return validate((value) => value.length >= len, compile(message, len));
}

function byteLength(len, message = '输入限制为$1个中文或特殊字符、$2个英文字母') {
  return validate(
    (value) =>
      value ? value.split('').reduce((count, char) => count + (Regex.SingleByte.test(char) ? 1 : 2), 0) <= len : true,
    compile(message, len / 2, len),
  );
}

function inRangeLen(minLen, maxLen, message = '请输入$1-$2个字符') {
  return validate((value) => value.length >= minLen && value.length <= maxLen, compile(message, minLen, maxLen));
}

function endsWith(str, message = '请输入以$1结尾的字符') {
  return validate((value) => value.endsWith(str), compile(message, str));
}

function startsWith(str, message = '请输入以$1开头的字符') {
  return validate((value) => value.startsWith(str), compile(message, str));
}

function matches(pattern, message) {
  return { pattern, message };
}

function chinese(message = '请输入中文字符串') {
  return matches(Regex.Chinese, message);
}

function mobile(message = '请输入正确的手机号') {
  return matches(Regex.Mobile, message);
}

function email(message = '请输入正确的email地址') {
  return { type: 'email', message };
}

function uri(message = '请输入正确的URI地址') {
  return matches(Regex.URI, message);
}

function url(message = '请输入正确的URL地址') {
  return { type: 'url', message };
}

function postalCode(message = '请输入邮件编码') {
  return matches(Regex.PostalCode, message);
}

function idCard(message = '请输入正确的身份证号码') {
  return matches(Regex.IDCard, message);
}

function positiveInteger(message = '请输入正整数') {
  return matches(Regex.PositiveInteger, message);
}

function negtiveInteger(message = '请输入负整数') {
  return matches(Regex.NegtiveInteger, message);
}

function integer(message = '请输入整数') {
  return matches(Regex.Integer, message);
}

function code(message = '请输入字母数字或者下划线') {
  return matches(Regex.Code, message);
}
function codeNum(message = '请输入字母或数字') {
  return matches(Regex.CodeNum, message);
}
function nonNegtiveInteger(message = '请输入非负整数') {
  return matches(Regex.NonNegtiveInteger, message);
}

function json(message) {
  return validate((value) => {
    let isJson;
    try {
      const result = JSON.parse(value);
      // 排除数值等其他类型
      isJson = isObject(result) || isArray(result);
    } catch (e) {
      isJson = false;
    }
    return isJson;
  }, message);
}

function departmentName(message = '请输入中文数字或者英文') {
  return matches(Regex.DepartmentName, message);
}

export default {
  validate,
  integer,
  negtiveInteger,
  positiveInteger,
  idCard,
  postalCode,
  url,
  uri,
  email,
  mobile,
  chinese,
  required,
  inRange,
  greaterThan,
  lessThan,
  includes,
  minLength,
  maxLength,
  maxSpecifiedCharLength,
  byteLength,
  inRangeLen,
  matches,
  endsWith,
  startsWith,
  json,
  code,
  codeNum,
  nonNegtiveInteger,
  departmentName,
};

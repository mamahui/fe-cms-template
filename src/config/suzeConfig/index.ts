import formBasic from './fieldTypes/formBasic';
import formBusiness from './fieldTypes/formBusiness';
import detailBasic from './fieldTypes/detailBasic';
import detailBusiness from './fieldTypes/detailBusiness';

export const SELECT_COMPONENTS = [
  'time',
  'enums',
  'coach',
  'video',
  'audio',
  'action-modal',
  'content-category',
  'upload',
  'system-config',
  'department',
  'dictionary-select',
  'millisecond',
  'business',
  'system-config',
];

export default {
  components: {
    ListTableForm: {
      detailFieldTypes: {
        ...detailBasic,
        ...detailBusiness,
      },
      formFieldTypes: {
        ...formBasic,
        ...formBusiness,
      },
    },
    Table: {
      pagination: {
        pageSizeOptions: [10, 20, 30, 50],
      },
      fieldTypes: {
        ...detailBasic,
        ...detailBusiness,
      },
    },
    Form: {
      fieldTypes: {
        ...formBasic,
        ...formBusiness,
      },
      placeholderPrefix: {
        [SELECT_COMPONENTS.join('|')]: '请选择',
        'unit|tags|textarea|positive-integer': '请输入',
      },
    },
    Description: {
      fieldTypes: {
        ...detailBasic,
        ...detailBusiness,
      },
    },
    ListContent: {
      currentKey: 'pageNumber',
      formProps: {
        labelWidth: 80,
      },
    },
  },
};

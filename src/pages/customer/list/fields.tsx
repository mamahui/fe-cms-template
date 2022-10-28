import { history } from 'umi';

export const searchFields = [
  { name: '标题', key: 'title' },
  { name: '标题1', key: 'title1' },
  { name: '标题2', key: 'title2' },
  { name: '标题3', key: 'title3' },
  { name: '标题4', key: 'title4' },
  { name: '标题5', key: 'title5' },
  { name: '标题6', key: 'title6' },
  { name: '标题7', key: 'title7' },
  { name: '标题8', key: 'title8' },
  { name: '标题9', key: 'title9' },
  { name: '标题10', key: 'title10' },
  { name: '标题11', key: 'title11' },
  { name: '标题12', key: 'title12' },
];

export const tableFields = [
  {
    name: '标题',
    key: 'title',
    render(values, record) {
      return (
        <div
          className="tableTitleWrap cursor"
          onClick={() => {
            history.push(`/client/consultdetail.html?id=${record.id}`);
          }}
        >
          {/*<img className="img" src={record.images[0]} alt="" />*/}
          <div className="textWrap">
            <p className="title">{values}</p>
            <p className="desc">{record.describe}</p>
          </div>
        </div>
      );
    },
  },
  {
    name: '类别',
    key: 'navType',
    render(values, record) {
      return <span>{values?.title}</span>;
    },
  },
  { name: '添加时间', key: 'update_time' },
  {
    name: '审核状态',
    key: 'is_verify',
    type: 'enums',
    props: {
      enums: {
        1: '已审核',
        2: '未审核',
        3: '已拒绝',
      },
    },
  },
];
export const addFields = [
  {
    name: '标题',
    key: 'title',
    props: {
      maxLength: 30,
      style: {
        width: '300px',
      },
    },
    required: true,
  },
  {
    name: '来源',
    key: 'author',
    props: {
      style: {
        width: '300px',
      },
    },
  },
  {
    name: '类别',
    key: 'nav2_id',
    required: true,
    type: 'enums',
  },
  { name: '封面图', key: 'images', type: 'upload', required: true },
  {
    name: '简介',
    key: 'describe',
    props: {
      style: {
        width: '300px',
      },
    },
  },
  // {
  //   name: '详情',
  //   key: 'content',
  //   type: 'editor',
  //   required: true,
  //   rules: [{ required: true, message: '请输入资讯详情' }],
  // },
];

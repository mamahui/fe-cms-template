import { useRef, useState, useEffect } from 'react';
import {Button} from 'antd';
import { ListContent, Form, Modal } from '@suze/components';
import { ListContentProps } from '@suze/components/es/list-content'
import {TableQueryActions} from '@suze/components/es/hooks/useTableQuery'
import { searchFields, tableFields, addFields } from './fields';


export default () => {
  const [form] = Form.useForm();
  const actionRef = useRef<TableQueryActions>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [navs] = useState<Record<string, any>>([
    { value: 1, label: 'test1' },
    { value: 2, label: 'test2' },
    { value: 3, label: 'test3' },
  ]);
  const [tableData, setTableData] = useState<TableDataType>({
    data: [],
    total: 0,
  });
  const [selectId, setSelectId] = useState<any[]>([]);
  const [newsDetail, setNewsDetail] = useState<Record<string, any>>({});


  useEffect(() => {
    getList({})
  }, [])
  async function getList(parmas) {
    console.log('parmas', parmas);
    setLoading(true);
    const data = {
      total: 100,
      data: [
        {title: '第一个', navType: {title: 123}, update_time: Date.now(), is_verify: 1, describe: '描述第一个' },
        {title: '第儿个', navType: {title: 123}, update_time: Date.now(), is_verify: 2, describe: '描述第2个' },
        {title: '第三个', navType: {title: 123}, update_time: Date.now(), is_verify: 3, describe: '描述第3个' },
        {title: '第四个', navType: {title: 123}, update_time: Date.now(), is_verify: 1, describe: '描述第4个' },
        {title: '第五个', navType: {title: 123}, update_time: Date.now(), is_verify: 2, describe: '描述第5个' },
      ],
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('params->', parmas);
        resolve(data);
        setLoading(false);
      }, 800);
      setTableData(data);
    });
  }
  const listContentProps: ListContentProps= {
    formProps: {
      fields: searchFields,
    },
    showCollapse: true,
    collapseProps: {
      collapsed,
      onCollapse: (nextCollapsed) => {
        setCollapsed(nextCollapsed)
      },
    },
    tableProps: {
      data: tableData.data,
      total: tableData.total,
      rowKey: 'title',
      fields: tableFields,
      rowSelection: {
        onChange: async (record, selectedRowKeys: any) => {
          setSelectId(record);
        },
        selectedRowKeys: selectId,
      },
      nextFields: [
        {
          key: 'action',
          name: '操作',
          width: 120,
          type: 'action',
          props: (_, record) => ({
            options: [
              {
                name: '修改',
                async onClick() {
                  console.log('修改');
                  setVisible(true);
                },
              },
              {
                name: '删除',
                async onClick() {
                  console.log('删除');
                },
              },
            ],
          }),
        },
      ],
      loading: loading,
    },
    fetchData: getList,
    toolbar: (
      <>
        <Button type="primary">新建Field</Button>
        <Button type="primary">批量删除Field</Button>
        <Button type="primary">新建Field</Button>
      </>
    )
  };
  const modalProps = {
    width: '80%',
    visible,
    form,
    title: '新建资讯',
    fields: addFields,
    labelCol: { span: 4 },
    nextFields: [
      {
        key: 'nav2_id',
        props: {
          enums: navs,
          style: {
            width: '300px',
          },
        },
      },
    ],
    okText: '确定',
    data: newsDetail,
    cancelText: '取消',
    onOk: async (values: any) => {
      const { images } = values;
      const params = {
        ...values,
        images: typeof images[0] === 'string' ? images : images[0]?.url,
      };
      actionRef.current?.onQuery();
    },
    afterClose: () => {
      setNewsDetail({});
      setVisible(false);
      form.resetFields();
    },
  };
  return (
    <>
      <ListContent ref={actionRef} {...listContentProps} />
      {visible && <Modal {...modalProps} />}
    </>
  )
}

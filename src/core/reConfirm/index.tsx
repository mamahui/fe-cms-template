import { Modal } from 'antd'

const reConfirm = ({
  title = '温馨提示',
  content = '',
  onOk = () => {}
}): void => {
  Modal.confirm({
    title: title,
    content: content,
    onOk: async () => {
      onOk && onOk()
    }
  })
}
export default reConfirm;

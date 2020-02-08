import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from  '../../api/index'
import { BASE_IMG_URL } from '../../utils/contans'

export default class PicturesWall extends React.Component {
	static propTypes = {
		imgs: PropTypes.array
	}

	constructor(props) {
		super(props)
		const { imgs } = props
		let fileList = []
		if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
				uid: -index,
				name: img,
				url: BASE_IMG_URL + img
			}))
		}
		this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
		}
	}

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
	}
	
	getImgs = () => {
		const imgs = this.state.fileList.map(img => img.name)
		return imgs
	}

  handleChange = async({ file, fileList }) => {
		if (file.status === 'done') {
			const result = file.response
			if (result.status === 0) {
				message.success('图片上传成功！')
				const { name, url } = result.data
				file = fileList[fileList.length-1]
				file.name = name
				file.url = url
			} else {
				message.error('图片上传失败！')
			}
		} else if (file.status === 'removed') {
			const result = await reqDeleteImg(file.name)
			if (result.status === 0) {
				message.success('图片删除成功！')
			} else {
				message.error('图片删除失败！')
			}
		}
		this.setState({ fileList })
	}

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
					action="/manage/img/upload"
					accept="image/*"
					name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

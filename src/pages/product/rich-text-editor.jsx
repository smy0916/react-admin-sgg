import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropsType from 'prop-types'


export default class RichTextEditor extends Component {
  static propsType = {
    detail: PropsType.string
  }

  constructor(props) {
    super(props)
    if (props.detail) {
      const contentBlock = htmlToDraft(props.detail)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = ({ editorState })
      }
    } else {
      this.state = { editorState: EditorState.createEmpty() }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest() // eslint-disable-line no-undef
        xhr.open('POST', '/manage/img/upload')
        xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca')
        const data = new FormData() // eslint-disable-line no-undef
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          resolve({data:{link: response.data.url}})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      },
    )
  }

  render () {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ border: '1px solid #ccc', minHeight: 200 }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } }}}
        />
      </div>
    )
  }
}
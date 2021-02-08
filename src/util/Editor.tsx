import React from "react";
import UtilContext from "../context/utilcontext";
import BraftEditor from "braft-editor"
import { ContentUtils } from "braft-utils"
import { ImageUtils } from "braft-finder"
import { Upload } from "antd"
import {
  PictureOutlined
} from "@ant-design/icons";
import QueryManage from "./QueryManage"
import "braft-editor/dist/index.css"
import UtilFunction from "./utilfunction";
import TypeNotification from "./createnotification";
import GetStyle from "./getStyle";

type TextEditorProps = {
  defaultValue: any,
  editable: boolean,
  name: string,
};

type TextEditorState = {
  editorState: any,
};

const toBase64 = (file: any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(this.props.defaultValue),
    }
  }
  public componentDidUpdate(prevProps: TextEditorProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({editorState: BraftEditor.createEditorState(this.props.defaultValue)})
    }
  }
  public render() {
    return (
      <UtilContext.UtilConsumer>
        {(utilObj: UtilObj) => {
          return this.getContent(utilObj);
        }}
      </UtilContext.UtilConsumer>
    );
  }
  public getEditorState() {
    return this.state.editorState;
  }
  private beforeUpload(file: any) {
    return true;
  }
  private async uploadHandler(option: any) {
    const {file} = option;
    const fileString = await toBase64(file).catch((err: any) => console.log(err));
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [{
        type: 'IMAGE',
        url: fileString,
      }]),
    });
  }
  /*
  private async uploadHandler(option: any, token: string) {
    const {file} = option;
    const fileString = await toBase64(file).catch((err: any) => console.log(err));
    // const fileData = new FormData();
    // fileData.append("file", file);
    const fileName = file.name;
    const postUrl = QueryManage.createUrl("/image/new");
    const postImageResult = await QueryManage.makeRequest(token, postUrl, "post", {fileString, fileName});
    console.log(postImageResult);
    if (!postImageResult.data.success) {
      TypeNotification("error", "upload image error");
      return;
    }
    const fileKey = postImageResult.data.fileKey;
    const getUrl = QueryManage.createUrl(`/image/${fileKey}`);
    console.log(getUrl);
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [{
        type: 'IMAGE',
        url: getUrl,
      }])
    })
  }
  */
  private handleChange(editorState: any) {
    this.setState({editorState});
  }
  private getContent(utilObj: UtilObj) {
    const {sizeObj, theme, userObj} = utilObj;
    const {token} = userObj;
    const {editable} = this.props;
    const style = GetStyle.formDiv(theme);
    if (!editable) {
      return (
        <div style={{...style, width: "100%", minWidth: "400px", padding: 0}}>
          <BraftEditor
            readOnly={true}
            language={"en"}
            value={this.state.editorState}
            controls={[]}
          />
        </div>
      );
    }
    const controls: any = ["bold", "italic", "underline", "text-color", "separator", "link", "separator", "blockquote", "code", "emoji"];
    const extendControls: any = [
      {
        key: "antd-uploader",
        type: "component",
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            // beforeUpload={(file: any) => this.beforeUpload(file)}
            customRequest={(option: any) => this.uploadHandler(option)}
          >
            <button type="button" className="control-item button upload-button" data-title="insert image">
              <PictureOutlined />
            </button>
          </Upload>
        )
      }
    ]
    return (
      <div style={{...style, width: "100%", minWidth: "400px", padding: 0}}>
        <BraftEditor
          style={{color: theme.value}}
          language={"en"}
          value={this.state.editorState}
          onChange={(editorState: any) => this.handleChange(editorState)}
          controls={controls}
          extendControls={extendControls}
        />
      </div>
    );
  }
}

export default TextEditor;

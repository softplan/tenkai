import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { ButtonToolbar } from 'react-bootstrap';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';

class NotesModal extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
    console.log(this.props.value);
    this.outputText = this.props.value;
  }

  save() {
    this.props.save(this.state.outputText);
  }

  render() {
    const SaveButton = props => {
      if (props.enableSave) {
        return <Button onClick={props.save}>Save</Button>;
      }
      return '';
    };

    return (
      <Modal show={this.props.show} onHide={this.props.close} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeMirror
            value={this.props.value}
            options={{
              mode: 'markdown',
              theme: '3024-night',
              lineNumbers: false,
              readOnly: false
            }}
            editorDidMount={editor => {
              setTimeout(() => editor.refresh(), 200);
            }}
            onChange={(editor, data, value) => {
              this.setState({
                outputText: value
              });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <SaveButton
              enableSave={this.props.enableSave}
              save={this.save.bind(this)}
            />
            <Button onClick={this.props.close}>Close</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NotesModal;

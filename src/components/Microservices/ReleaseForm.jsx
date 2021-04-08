import React, { useState, useEffect } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { Button } from 'react-bootstrap';

export const ReleaseForm = props => {
  const [formData, setFormData] = useState({
    ID: '',
    chartName: '',
    release: ''
  });

  useEffect(() => {
    if (props.editItem) {
      setFormData(props.editItem);
    }
  }, [props.editItem]);

  return (
    <div>
      <CardTenkai
        title={props.editMode ? 'Edit Release' : 'New Release'}
        content={
          <form>
            <FormInputs
              ncols={['col-md-2']}
              properties={[
                {
                  name: 'release',
                  label: 'Release Number',
                  type: 'text',
                  bsPrefix: 'form-control',
                  placeholder: 'Version',
                  value: formData.release,
                  onChange: event => {
                    const { value, name } = event.target;
                    setFormData({
                      ...formData,
                      [name]: value
                    });
                  }
                }
              ]}
            />
            <div className="btn-toolbar">
              <div className="btn-group">
                <Button
                  variant="info"
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    props.saveClick(formData);
                  }}
                >
                  Save
                </Button>
              </div>
              <div className="btn-group">
                <Button
                  variant="info"
                  type="button"
                  onClick={props.cancelClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        }
      />
    </div>
  );
};

export default ReleaseForm;

import React, { Fragment, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { ToastContext } from '../../contextStore/ToastContext';
import OverlaySpinner from '../Loading/OverlaySpinner';
import AdForm from './AdForm';
import './Create.css';
import { handleSaveDraft, handleSubmit } from './createHandlers';
import { useCreateForm } from './useCreateForm';

const Create = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const {
    values,
    loading,
    draftLoading,
    setDraftLoading,
    errors,
    setErrors,
    setLoading,
    onChange,
  } = useCreateForm();

  const onSubmit = () =>
    handleSubmit({
      values,
      user,
      addToast,
      history,
      setLoading,
      setErrors,
    });

  const onSaveDraft = () =>
    handleSaveDraft({
      values,
      user,
      addToast,
      history,
      setLoading: setDraftLoading,
      setErrors,
    });

  return (
    <Fragment>
      {(loading || draftLoading) && <OverlaySpinner />}
      <div className="createPageWrap">
        <div className="createPageActions">
          <Link to="/" className="createCancelLink">
            ← Cancel
          </Link>
        </div>
        <AdForm
          values={values}
          onChange={onChange}
          errors={errors}
          loading={loading}
          draftLoading={draftLoading}
          onSubmit={onSubmit}
          submitLabel="Post ad"
          onSaveDraft={onSaveDraft}
        />
      </div>
    </Fragment>
  );
};

export default Create;

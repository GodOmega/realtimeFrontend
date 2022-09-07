import React from 'react'

import styles from './style.module.css'

const Modal = ({children, closeModal}) => {
  return (
    <div className={styles.modal__container}>
        <span onClick={() => closeModal()}>
            x
        </span>
        {children}
    </div>
  )
}

export default Modal
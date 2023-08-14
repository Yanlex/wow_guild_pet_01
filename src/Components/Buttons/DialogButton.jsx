import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'

function DialogButton(props) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="button"
        >
          {props.buttonText}
        </button>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className=""
      >
        {/* Full-screen container to center the panel */}
        <div className="dialogMain">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="dialogMain-content">
            <Dialog.Title style={{ padding: '0 0 10px 0', }}>{props.formTitle}</Dialog.Title>
            {props.childComponent}
            <button onClick={() => setIsOpen(false)} className='button'>Закрыть</button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>


  )
}

export default DialogButton
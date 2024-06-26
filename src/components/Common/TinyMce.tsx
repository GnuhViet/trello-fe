import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export interface TinyMceProps {
    value: string
    setValue: (value: string) => void
    disableAutoFocus?: boolean
    disableChange?: boolean
}

const initConfig = {
    height: '260px',
    menubar: false,
    plugins: 'lists advlist table link',
    paste_data_images: false,
    toolbar: [
        // { name: 'history', items: ['undo', 'redo'] },
        { name: 'styles', items: ['styles'] },
        { name: 'formatting', items: ['fontsizeinput', 'bold', 'underline', 'italic'] },
        { name: 'alignment and list', items: ['align', 'bullist', 'table', 'link'] }
    ],
    setup: function (editor) {
        editor.on('keydown', function (e) {
            if (e.keyCode === 9) {
                e.preventDefault()
                editor.execCommand('mceInsertContent', false, '&emsp;')
            }
        })
    }
}

const TinyMce: React.FC<TinyMceProps> = ({ value, setValue, disableAutoFocus, disableChange }) => {

    return (
        <Editor
            apiKey='qb1sn5smc05czikfntqzx93pg52hvp4j9fwoycii8gi6rtm3'
            init={
                disableAutoFocus
                    ?
                    { initConfig }
                    :
                    {
                        auto_focus: true,
                        ...initConfig
                    }
            }
            value={value}
            onEditorChange={(content) => setValue(content)}
            disabled={disableChange}
        />
    )
}

export default TinyMce
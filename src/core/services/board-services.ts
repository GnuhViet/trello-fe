import { IMessage } from 'react-stomp-hooks'
import { Dispatch } from '@reduxjs/toolkit'
import { addCard, addColumn, updateColumnOrderResponse } from '~/core/redux/slices/boardSlice'

export enum ACTION {
    CREATE_COLUMN = 'CREATE_COLUMN',
    MOVE_COLUMN = 'MOVE_COLUMN',
    DELETE_COLUMN = 'DELETE_COLUMN',
    CREATE_CARD = 'CREATE_CARD',
    MOVE_CARD = 'MOVE_CARD',
    DELETE_CARD = 'DELETE_CARD'
}


export const handleSocketEvent = (event: IMessage, dispatch: Dispatch) => {
    const resp = JSON.parse(event.body)

    switch (resp.action) {
    case ACTION.CREATE_COLUMN:
        dispatch(addColumn(resp.data))
        break
    case ACTION.MOVE_COLUMN:
        dispatch(updateColumnOrderResponse(resp.data))
        break
    case ACTION.DELETE_COLUMN:
        console.log('DELETE_COLUMN', resp)
        break
    case ACTION.CREATE_CARD:
        dispatch(addCard(resp.data))
        console.log('CREATE_CARD', resp)
        break
    case ACTION.MOVE_CARD:
        console.log('MOVE_CARD', resp)
        break
    case ACTION.DELETE_CARD:
        console.log('DELETE_CARD', resp)
        break
    default:
        break
    }
}

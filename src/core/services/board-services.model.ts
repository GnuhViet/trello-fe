export class BoardColumnCreateReq {
    title: string
}

export class BoardColumnCreateResp {
    id: string
    boardId: string
    title: string
}

export class BoardColumnMoveReq {
    columnOrderIds: string[]
}

export class BoardCardCreateReq {
    boardColumnId: string
    title: string
}

export class BoardCardCreateResp {
    id: string
    title: string
    boardColumnId: string
}

export class BoardCardMoveReq {
    cardId: string
    oldColumnId: string
    newColumnId: string
    cardOrderIds: string[]
}
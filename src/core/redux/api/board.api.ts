import { API_ROOT } from '~/core/utils/constants'
const API_URL = 'api/v1/board'

import { apiSlice } from '~/core/redux/api/base.api'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Board } from '../../model/board.model'
import { create } from 'lodash'
import { BoardBgUpdateReq, BoardCreateReq, BoardInfoUpdateReq, BoardStarReq, DeleteColumReq, UpdateColumTitleReq } from '~/core/services/board-services.model'

export type Channel = 'redux' | 'general'

// export const boardApi = createApi({
//     reducerPath: 'boardApi',
//     baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
//     refetchOnMountOrArgChange: true,

//     endpoints: (builder) => ({
//         getBoardByCode: builder.query<Board, string>({
//             query: (code) => ({
//                 url: `${API_URL}/${code}`,
//                 method: 'GET'
//             })
//         }),
//         getAllBoard: builder.query<Board[], void>({
//             query: () => ({
//                 url: `${API_URL}`,
//                 method: 'GET'
//             })
//         })
//     })
// })

export const boardApi = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getBoardByCode: builder.query({
            query: (code: string) => ({
                url: `${API_URL}/${code}`,
                method: 'GET'
            })
        }),
        getUserWorkspaceBoard: builder.query({
            query: (workspaceId: string) => ({
                url: `${API_URL}/workspace-boards/${workspaceId}`,
                method: 'GET'
            })
        }),
        getAllBoard: builder.query({
            query: () => ({
                url: `${API_URL}`,
                method: 'GET'
            })
        }),
        createBoard: builder.mutation({
            query: (data: BoardCreateReq) => ({
                url: `${API_URL}`,
                method: 'POST',
                body: data
            })
        }),
        getBoardInfomation: builder.query({
            query: (boardId: string) => ({
                url: `${API_URL}/info/${boardId}`,
                method: 'GET'
            })
        }),
        updateBoardInfomation: builder.mutation({
            query: (data: BoardInfoUpdateReq) => ({
                url: `${API_URL}/update-board-info`,
                method: 'POST',
                body: data
            })
        }),
        updateBoardBackground: builder.mutation({
            query: (data: BoardBgUpdateReq) => ({
                url: `${API_URL}/update-board-background`,
                method: 'POST',
                body: data
            })
        }),
        updateStarBoard: builder.mutation({
            query: (data: BoardStarReq) => ({
                url: `${API_URL}/board-star`,
                method: 'POST',
                body: data
            })
        }),
        deleteBoardCard: builder.mutation({
            query: (cardId: string) => ({
                url: `${API_URL}/delete-board-card`,
                method: 'POST',
                body: {
                    cardId: cardId
                }
            })
        }),
        updateColumnTitle: builder.mutation({
            query: (data: UpdateColumTitleReq) => ({
                url: `${API_URL}/update-colum-title`,
                method: 'POST',
                body: data
            })
        }),
        deleteBoardColumn: builder.mutation({
            query: (id: string) => ({
                url: `${API_URL}/delete-colum`,
                method: 'POST',
                body: {
                    id: id
                }
            })
        })
    })
})

// export const {
//     useLoginMutation
// } = authApiSlice

export const {
    useGetBoardByCodeQuery,
    useLazyGetBoardByCodeQuery,
    useGetAllBoardQuery,
    useCreateBoardMutation,
    useLazyGetBoardInfomationQuery,
    useUpdateBoardInfomationMutation,
    useUpdateBoardBackgroundMutation,
    useUpdateStarBoardMutation,
    useDeleteBoardCardMutation,
    useUpdateColumnTitleMutation,
    useDeleteBoardColumnMutation,
} = boardApi
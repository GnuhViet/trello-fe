import React from 'react'

import HomeFC from '~/pages/Home/HomeFC'

import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import ErrorPage from './pages/Error/ErrorPage'

import RequireAuth from '~/pages/Auth/RequireAuth'
import BoardComponentWrap from './pages/Boards/BoardComponentWrap'
import LoginFC from './pages/Auth/LoginFC'
import RegisterFC from '~/pages/Auth/RegisterFC'
import MemberFC from '~/pages/member-settings/MemberFC'
import RequireRole from './pages/Auth/RequireRole'
import WorkspaceSettingFC from './pages/workspace-settings/WorkspaceSettingFC'
import JoinInviteFC from './pages/Auth/JoinInviteFC'
import ProfileFC from './pages/User/ProfileFC'
import Box from '@mui/material/Box'
import TinyMce from './components/Common/TinyMce'
import RouterWrapper from './routerwrap/RouterWrapper'
import HomeWrapper from './routerwrap/HomeWrapper'
import DashboardFC from './pages/Dashboard/DashboardFC'
import BoardGridFC from './pages/BoardGrid/BoardGridFC'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        // element: <Layout />,
        element: <RouterWrapper />,
        children: [
            // { path: '', element: <Public/> },
            { path: '/login', element: <LoginFC /> },
            { path: '/register', element: <RegisterFC /> },
            {
                element: <RequireAuth />,
                children: [
                    {
                        element: <HomeWrapper />,
                        children: [
                            { path: '/home', element: <HomeFC /> },
                            { path: '/invite/:id', element: <JoinInviteFC /> },
                            { path: '/error', element: <ErrorPage /> },
                            { path: '/profile', element: <ProfileFC /> },
                            {
                                element: <RequireRole />,
                                path: '/w/:workspaceId',
                                children: [
                                    { path: 'board-grid', element: <BoardGridFC /> },
                                    { path: 'dashboard', element: <DashboardFC /> },
                                    { path: 'settings', element: <WorkspaceSettingFC /> },
                                    { path: 'member', element: <MemberFC /> },
                                    { path: 'b/:boardId', element: <BoardComponentWrap /> }
                                    // { path: '/boards', element: <BoardComponentWrap /> }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
])

const App: React.FC = () => {
    return (
        <>
            {/* React Router Dom /boards /boards/{board_id} */}
            {/* Board Details */}

            <RouterProvider router={router} />

            {/* PRE LOAD TINY MCE */}
            {/* <Box sx={{ display: 'none' }}>
                <TinyMce value={null} setValue={null} />
            </Box> */}
            {/* <RouterProvider router={router} /> */}
            {/* <Box sx={{ display: 'none' }}>
                <BoardComponent />
            </Box> */}
        </>
    )
}

export default App

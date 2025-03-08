import { getUser } from './actions/getUser'


import UserTable from './userTable'
import { Button } from '@/components/ui/button'

import {NewUserCreate} from "@/app/admin/NewUserCreate"

const Admin = async () => {
    const users = await getUser()
    const plainUsers = JSON.parse(JSON.stringify(users));

    return (
        <>


        <div className="flex flex-col">

            <UserTable initialUsers={plainUsers} />

            <NewUserCreate />
            </div>
        </>
    )
}

export default Admin

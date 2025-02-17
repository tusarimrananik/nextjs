import { FC } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface GmailProps {

}

const Gmail: FC<GmailProps> = ({ }) => {
    return (
        <div className="flex p-5">
            <Input type="email" placeholder="Gmail"></Input>
            <Input type="url" placeholder="Gmail Name"></Input>
            <Button>Hack</Button>
        </div>
    )
}

export default Gmail
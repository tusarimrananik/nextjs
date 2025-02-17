import { FC } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface WhatsappProps { }

const Whatsapp: FC<WhatsappProps> = ({ }) => {
    return (
        <div className="flex p-5">
            <Input type="text" placeholder="WhatsApp Number"></Input>
            <Input type="url" placeholder="WhatsApp Name"></Input>
            <Input type="url" placeholder="WhatsApp About"></Input>
            <Input id="picture" type="file" />
            <Button>Hack</Button>
        </div>
    )
}

export default Whatsapp
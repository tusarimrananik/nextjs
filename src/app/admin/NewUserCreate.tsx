"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function NewUserCreate() {

  const [name, setName] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [error, setError] = useState("");



  function handleSubmit() {
    fetch('/api/admin/newUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        accessToken
      })
    }).then(response => {


      if (!response.ok) {
        setError("Respone was not ok!!!")
        throw new Error('Network response was not ok');
      }

      setError("SuccessFully Created an User to the database!");

      return response.json();

    }).catch(error => {
      setError(error)
      console.error('Error:', error);
    });

  }

  return (


    <Dialog>

      <DialogTrigger asChild>
        <Button variant="outline" >Create A new user</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input onChange={(e) => { setName(e.target.value) }} id="name" value={name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Access Token
            </Label>
            <Input onChange={(e) => { setAccessToken(e.target.value) }} id="username" value={accessToken} className="col-span-3" />
          </div>


          {error &&
            <div className="text-red-500">{error}</div>
          }
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>



  )
}

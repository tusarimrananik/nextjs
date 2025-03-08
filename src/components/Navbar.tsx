"use client";
import { FC, useState } from 'react'
import { User } from 'lucide-react';
import { House } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Card } from './ui/card';
import { Key } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { UserCog } from 'lucide-react';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signIn, signOut, useSession } from "next-auth/react"

import { getUser } from '@/app/admin/actions/getUser';


const Navbar: FC = () => {
  const { data: session, status } = useSession()

 
  const handleLogin = async (accessToken: string) => {
    const result = await signIn("credentials", {
      accessToken: accessToken,
      redirect: true, // Prevent full page reload
    });

    if (result?.error) {
      console.log("Login failed:", result.error);
    } else {
      console.log("Login successful:", result);
    }
  };



  const [accessToken, setAccessToken] = useState('')

  return (

    <Card className='rounded-none flex justify-between items-center p-4'>




      <div className='flex items-center space-x-2'>
        <Link href="/">
          <Button variant="outline" size="icon">
            <House />
          </Button>
        </Link>

        {status === "authenticated" && session?.user?.name === "Admin" &&
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <UserCog />
            </Button>
          </Link>
        }
      </div>


      {
        status === "authenticated" ? (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {
                    session?.user?.name
                  }
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Edit Left
                    <DropdownMenuShortcut>
                      {
                        session?.user?.numberOfOperations
                      }
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>
                      {
                        session?.user?.balance
                      }
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <Button className='' variant="destructive" size="sm">
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out from your account!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => signOut({ redirect: false })}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <User />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enter Access Token</DialogTitle>
                <DialogDescription>
                  Please enter your access token to login!
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    id="link"
                    name="link"
                    type='password'
                    onChange={(e) => setAccessToken(e.target.value)}
                    value={accessToken}
                  />
                </div>
                <Button onClick={() => { handleLogin(accessToken) }} type="submit" className="px-3">
                  <Key />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }


    </Card >





  )
}

export default Navbar




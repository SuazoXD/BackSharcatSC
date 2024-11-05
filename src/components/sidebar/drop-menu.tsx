import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from "../ui/dropdown-menu";

type PhotoProp = {
    profilePhoto?: string
}

const DropdownProfile: React.FC<PhotoProp> = ({profilePhoto}) => {



    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <img src={profilePhoto} alt="" className="rounded-full" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-1">
                    <DropdownMenuItem >Cambiar contraseña</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem >Cerrar sesion</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default DropdownProfile;
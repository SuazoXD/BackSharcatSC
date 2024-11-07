import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Offer } from '../interfaces/oferta';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CompleteOfferCardProp = {
    offer: Offer
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const OfferCard: React.FC<CompleteOfferCardProp> = ({offer}) => {

    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleProfileClick = (idTutor: number) => {
        router.push(`/home/profile/profile-guest?tutor=${idTutor}`)
    }

    const handleOfferClick = (offer: any) => {
        setSelectedOffer(offer);
        setIsOpen(true);
    }
    useEffect(() => {
        if (selectedOffer) {
            console.log("Oferta seleccionada:", selectedOffer);
        }
    }, [selectedOffer]);

    const handleAcceptOffer = async (idOferta: number) => {
        try {

            const access_token = sessionStorage.getItem("access_token");

            if(!access_token){
                console.error("Token no encontrado");
            }

            const res = await fetch(`${apiUrl}/user/pregunta/aceptar-oferta`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({idOferta})
            });

            if(!res.ok){
                console.log("error al actualizar estado de la oferta");
            } else {
                console.log("Estado de la pregunta actualizado correctamente");
                setIsOpen(false);

            }

        } catch (error) {
            console.error(`Error handleAcceptOffer ${error}`);
        }
    }

    return (
        <>
            <div key={offer.idOferta} onClick={() => handleOfferClick(offer)} className="flex items-center border-b border-gray-300 p-3 w-full">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14  ">
                    <img src={offer.usuario.fotoPerfil} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="ml-3 flex flex-col justify-center ">
                    <p className="font-semibold text-md">{`${offer.usuario.nombre.primerNombre} ${offer.usuario.nombre.primerApellido}`}</p>
                    <p className="font-light text-gray-600 text-sm line-clamp-1 overflow-hidden">
                        {offer.descripcion}
                    </p>
                    <p className="font-light text-gray-600 text-sm">
                        {new Date(offer.fechaOferta).toLocaleString()}
                    </p>
                </div>
                <div className='ml-auto'>
                </div>
            </div>
        
            {/* DIALOG OFERTA */}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50">
                        <DialogContent
                            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 
                                max-w-96 rounded-xl sm:max-w-[100vh]  w-full
                                outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll
                            }`}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-md font-bold text-center">
                                    Detalles de la oferta
                                </DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center border-t border-gray-300 p-3 w-full">
                                <div onClick={() => handleProfileClick(offer.usuario.idUsuario)} className="flex-shrink-0 w-[12vh] h-[12vh] sm:w-[20vh] sm:h-[20vh]">
                                    <img src={selectedOffer?.usuario.fotoPerfil} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col ml-3 justify-center w-full">
                                    <p className="font-semibold text-md text-center">{`${offer.usuario.nombre.primerNombre} ${offer.usuario.nombre.primerApellido}`}</p>
                                    <p className="font-ligth text-sm text-center">{offer.usuario.correo}</p>
                                    <p className="flex justify-center font-ligth text-sm text-center">
                                        {offer.usuario.valoracion}
                                        <Star className="w-4 h-4 ml-1 text-yellow-500" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col my-5 justify-center w-full">
                                <p className="font-ligth text-sm text-center">{offer.descripcion}</p>
                            </div>
                            <div className='border my-3'>
                            </div>
                            <div className="flex mt-2 text-xs justify-between justify-center w-full">
                                <p className=''>
                                    {new Date(offer.fechaOferta).toLocaleString()}
                                </p>
                                <p>
                                    {offer.estadoOfertaSolucion?.estadoOferta}
                                </p>
                            </div>
                            <div className='border my-3'>
                            </div>
                            <div className='flex w-full justify-center'>
                                {offer.estadoOfertaSolucion?.idEstadoOferta === 1 && (
                                    <Button onClick={() => handleAcceptOffer(offer.idOferta)}>Aceptar</Button>
                                )}
                            </div>
                        </DialogContent>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
        </>
    );
};

export default OfferCard;
import { FaTruckFast } from "react-icons/fa6";
import ModelCard from "../common/ModelCard";
import { VscVerified } from "react-icons/vsc";
import { BsHeadset } from "react-icons/bs";
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export default function Characteristics() {
    useEffect(() => {
        ScrollReveal().reveal('#model-card', { delay: 700, distance: '20px', duration: 500 });
        ScrollReveal().reveal('#t1c', { distance: '20px', duration: 1400, origin: 'top' });
    }, []);

    return (
        <div className="flex flex-col my-5 gap-8">
            <div className="flex justify-center">    
            <h1 id="t1c" className="text-3xl text-center  bg-black text-white px-5 italic font-bold">Só aqui você tem</h1>
            </div>
            <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
            <ModelCard icon={FaTruckFast} title="Entrega Rápida" description="Receba seus produtos rapidamente e eficientemente."/>
            <ModelCard icon={VscVerified} title="Produto Fiel As Fotos" description="Produto original e de alta qualidade."/>
            <ModelCard icon={BsHeadset} title="Atendimento Rápido" description="Receba seu atendimento de modo rápido e eficiente."/>
            </div>
        </div>
    )
}
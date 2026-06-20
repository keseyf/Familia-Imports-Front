export default function Footter() {
    return (
        <div className="w-full bg-neutral-950 flex flex-col items-center justify-beetween px-5">
            <div className="flex items-center justify-center w-full">

                <div>

                    <img onDoubleClick={()=>{window.location.href = "/admin"}} className="h-12 my-5" src={`./logodefinitiva23.png`} alt="" />
                </div>
                
            </div>
            <p className="text-sm text-neutral-300 mb-3">© Família Imports 2026 - Todos os direitos reservados</p>
        </div>
    )
}
import type { IconType } from "react-icons";

export default function ModelCard({icon, title, description}: {icon: IconType, title: string, description: string}) {
    return (
        <div id="model-card" className="flex w-full bg-neutral-100 flex-1 rounded-2xl p-5 items-center gap-6 border-neutral-800/20 border">
            <div>
                {icon({size: 35, className: "text-neutral-700"})}
            </div>
            <div className="flex flex-col gap-4">
                <h3 className=" font-bold text-sm text-green-600">{title}</h3>
                <p className="text-xs text-black/60">{description}</p>
            </div>
        </div>
    )
}
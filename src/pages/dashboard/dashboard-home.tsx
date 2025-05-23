

// type HeaderKpi = {
//     icon: Icon,
//     label: string,
//     value: string,
//     trend: "pos" | "neg" | "steady" //ArrowUp | ArrowDown | Tilde,
//     vs: string
//     percentage: number
// }

// function KPI({
//     trend,
//     label,
//     value,
//     vs,
//     percentage,
//     icon,
//              }: HeaderKpi) {
//     const Trend = trend == "pos"? ArrowUp : trend == "neg"? ArrowDown : Tilde
//     const Icon = icon
//     return (
//         <div>
//             <div className="flex items-center justify-center w-full text-zinc-600">
//                 <Icon/>
//                 {label}
//             </div>
//             <div className="flex items-center">
//                 {value} <Trend/> {percentage} vs {vs}
//             </div>
//         </div>
//     )
// }


function DashboardHome() {
    return (
        <div>
            <section className="flex">

            </section>
        </div>
    );
}

export default DashboardHome;



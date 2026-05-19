import useSidebarHook from "@/hooks/useSidebarHook";

const menuSejarahIndonesia = [
  { id: "periode-prasejarah", label: "Periode prasejarah" },
  { id: "periode-monarki", label: "Periode monarki" },
  { id: "periode-kolonial", label: "Periode kolonial" },
  { id: "periode-pendudukan", label: "Periode pendudukan" },
  { id: "periode-republik", label: "Periode republik" },
];

export default function SidebarContent({ activeSection }: { activeSection: string }) {
  const {handleScroll} = useSidebarHook();

  return (
    <div className="flex lg:h-[calc(100vh-64px)] flex-col p-4 bg-gray-200">
      <ul className="overflow-y-auto no-scrollbar space-y-2 pt-16 lg:pt-0">
        {menuSejarahIndonesia.map((m, i) => (
          <li key={`menu-list-${i}`}>
            <button
              onClick={() => handleScroll(m.id)}
              className={`block rounded-lg px-4 transition-all
                  ${activeSection === m.id
                  ? "text-blue-500"
                  : "text-gray-800 hover:text-blue-500"
                }
              `}
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
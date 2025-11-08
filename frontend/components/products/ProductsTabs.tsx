// components/ProductTabs.tsx
import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProductTabs({
  activeTab,
  setActiveTab,
}: ProductTabsProps) {
  return (
    <div className="flex space-x-2 border-b border-gray-300 mb-4">
      <button
        onClick={() => setActiveTab("specifications")}
        className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-md transition-all duration-300 ${
          activeTab === "specifications"
            ? "bg-white border-x border-t border-gray-300 text-blue-600"
            : "bg-gray-100 text-gray-600 hover:text-blue-500"
        }`}
      >
        <ClipboardDocumentListIcon className="h-5 w-5" />
        Specifications
      </button>

      <button
        onClick={() => setActiveTab("listings")}
        className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-md transition-all duration-300 ${
          activeTab === "listings"
            ? "bg-white border-x border-t border-gray-300 text-blue-600"
            : "bg-gray-100 text-gray-600 hover:text-blue-500"
        }`}
      >
        <ShoppingBagIcon className="h-5 w-5" />
        Listings
      </button>
    </div>
  );
}

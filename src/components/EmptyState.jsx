// src/components/EmptyState.jsx
import { FiPlusCircle } from 'react-icons/fi'

const EmptyState = ({ 
    title, 
    description, 
    actionLabel, 
    onAction,
    icon: Icon 
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-96">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Icon size={48} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
            <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    <FiPlusCircle size={20} />
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState
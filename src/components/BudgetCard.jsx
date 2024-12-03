import React, { useState } from 'react'
import { 
    FiCoffee, FiCamera, FiShoppingBag, FiTruck, FiHome, FiBook, 
    FiMusic, FiMonitor, FiDollarSign, FiGrid, FiPackage, 
    FiBriefcase, FiSettings, FiShield, FiLifeBuoy, FiBell,
    FiTarget, FiList, FiFolder, FiStar
} from 'react-icons/fi'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { notify } from '../utils/toast'

const BudgetCard = ({
    id,
    name = "Coffee Budget",
    emoji = "FiCoffee", // Keep as string
    amount = 150,
    spent = 50,
    transactions = 3,
    onDelete,
    onEdit,
    compact = false // New prop
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editedBudget, setEditedBudget] = useState({
        id,
        name,
        amount,
        spent,
        transactions,
        emoji
    })

    const navigate = useNavigate()

    const icons = {
        // Essential Categories
        FiHome: <FiHome size={24} />,           // Housing/Rent
        FiTruck: <FiTruck size={24} />,         // Transportation
        FiShield: <FiShield size={24} />,       // Insurance
        FiLifeBuoy: <FiLifeBuoy size={24} />,   // Healthcare
        FiBriefcase: <FiBriefcase size={24} />, // Work
        
        // Lifestyle Categories
        FiCoffee: <FiCoffee size={24} />,       // Dining/Coffee
        FiMusic: <FiMusic size={24} />,         // Entertainment
        FiShoppingBag: <FiShoppingBag size={24} />, // Shopping
        FiStar: <FiStar size={24} />,           // Personal
        FiBell: <FiBell size={24} />,           // Subscriptions
        
        // Tech Categories
        FiSettings: <FiSettings size={24} />,    // Electronics
        FiMonitor: <FiMonitor size={24} />,     // Devices
        FiGrid: <FiGrid size={24} />,           // Services
        
        // Other Categories
        FiBook: <FiBook size={24} />,           // Education
        FiCamera: <FiCamera size={24} />,       // Photography
        FiTarget: <FiTarget size={24} />,       // Goals
        FiDollarSign: <FiDollarSign size={24} />, // Investments
        FiList: <FiList size={24} />,           // Bills
        FiPackage: <FiPackage size={24} />,     // Shopping
        FiFolder: <FiFolder size={24} />        // Miscellaneous
    }

    const remaining = amount - spent
    const progress = (spent / amount) * 100

    const getProgressColor = () => {
        if (progress >= 90) return 'bg-red-500'        // Critical (red)
        if (progress >= 80) return 'bg-orange-500'     // Warning (orange)  
        if (progress >= 70) return 'bg-yellow-500'     // Caution (yellow)
        if (progress >= 60) return 'bg-blue-500'       // Notice (blue)
        if (progress >= 40) return 'bg-emerald-500'    // Good (emerald)
        return 'bg-green-500'                          // Excellent (green)
    }

    const handleEdit = () => {
        const updatedBudget = {
            ...editedBudget,
            // Keep emoji as string key
            amount: Number(editedBudget.amount),
            spent: Number(editedBudget.spent)
        }
        onEdit(updatedBudget)
        setIsEditModalOpen(false)
        notify.success('Budget updated successfully')
    }

    return (
        <>
            <div 
                className={`bg-white rounded-xl w-full border border-base-300 list-none ${
                    compact ? 'p-3' : 'p-4'
                } hover:border-slate-400 transition-all cursor-pointer`}
                onClick={(e) => {
                    // If clicking edit button, don't navigate
                    if (e.target.closest('button')) {
                        e.stopPropagation();
                        return;
                    }
                    navigate(`/budget/${id}`);
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`bg-slate-100/80 text-2xl ${
                            compact ? 'h-10 w-10' : 'h-12 w-12'
                        } rounded-full flex justify-center items-center text-slate-600`}>
                            {icons[emoji] || icons.FiCoffee}
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-bold ${
                                compact ? 'text-base' : 'text-xl'
                            } text-slate-800`}>{name}</span>
                            {!compact && (
                                <span className="text-slate-500 text-sm">
                                    {transactions} transaction(s)
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={`font-bold ${
                        compact ? 'text-base' : 'text-xl'
                    } text-slate-600`}>{amount}€</div>
                </div>

                <div className="flex justify-between items-center text-slate-500 text-sm mb-2">
                    <span>{spent}€ spent</span>
                    <span>{remaining}€ remaining</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div
                        className={`${getProgressColor()} h-2 rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                {!compact && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="mt-2 text-sm text-slate-600 hover:text-slate-800"
                    >
                        Edit Budget
                    </button>
                )}
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Budget</h3>
                        <input
                            type="text"
                            placeholder="Budget Name"
                            className="w-full mb-2 p-2 border rounded"
                            value={editedBudget.name}
                            onChange={e => setEditedBudget({ ...editedBudget, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-full mb-2 p-2 border rounded"
                            value={editedBudget.amount}
                            onChange={e => setEditedBudget({ ...editedBudget, amount: Number(e.target.value) })}
                        />
                        <input
                            type="number"
                            placeholder="Spent Amount"
                            className="w-full mb-2 p-2 border rounded"
                            value={editedBudget.spent}
                            onChange={e => setEditedBudget({ ...editedBudget, spent: Number(e.target.value) })}
                        />
                        <select
                            className="w-full mb-2 p-2 border rounded"
                            value={editedBudget.emoji}
                            onChange={e => setEditedBudget({ ...editedBudget, emoji: e.target.value })}
                        >
                            <optgroup label="Essential">
                                <option value="FiHome">Housing/Rent</option>
                                <option value="FiTruck">Transportation</option>
                                <option value="FiShield">Insurance</option>
                                <option value="FiLifeBuoy">Healthcare</option>
                                <option value="FiBriefcase">Work</option>
                            </optgroup>
                            <optgroup label="Lifestyle">
                                <option value="FiCoffee">Dining/Coffee</option>
                                <option value="FiMusic">Entertainment</option>
                                <option value="FiShoppingBag">Shopping</option>
                                <option value="FiStar">Personal</option>
                                <option value="FiBell">Subscriptions</option>
                            </optgroup>
                            <optgroup label="Tech">
                                <option value="FiSettings">Electronics</option>
                                <option value="FiMonitor">Devices</option>
                                <option value="FiGrid">Services</option>
                            </optgroup>
                            <optgroup label="Other">
                                <option value="FiBook">Education</option>
                                <option value="FiCamera">Photography</option>
                                <option value="FiTarget">Goals</option>
                                <option value="FiDollarSign">Investments</option>
                                <option value="FiList">Bills</option>
                                <option value="FiPackage">Shopping</option>
                                <option value="FiFolder">Miscellaneous</option>
                            </optgroup>
                        </select>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleEdit}
                                className="bg-slate-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="border border-slate-300 px-4 py-2 text-sm rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

BudgetCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    emoji: PropTypes.string,
    amount: PropTypes.number,
    spent: PropTypes.number,
    transactions: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    compact: PropTypes.bool
}

export default BudgetCard
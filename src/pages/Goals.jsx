// src/pages/Goals.jsx
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addGoal, deleteGoal, updateGoalProgress, updateGoal } from '../store/goalSlice'
import { FiTarget, FiPlus, FiTrash2, FiClock, FiFilter, FiAward, FiFlag, FiGrid, FiList, FiMenu, FiChevronDown, FiChevronUp, FiMaximize, FiMinimize, FiEdit2 } from 'react-icons/fi'
import { notify } from '../utils/toast'

const getCategoryColor = (category) => {
    const colors = {
        savings: 'blue',
        investment: 'purple',
        debt: 'red',
        purchase: 'orange',
        retirement: 'emerald',
        emergency: 'yellow',
        vacation: 'pink',
        education: 'indigo',
        housing: 'cyan',
        other: 'gray'
    }
    return colors[category] || colors.other
}

const Goals = () => {
    const dispatch = useDispatch()
    const goals = useSelector(state => state.goals.items)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [filter, setFilter] = useState('all')
    const [viewLayout, setViewLayout] = useState('grid')
    const [newGoal, setNewGoal] = useState({
        name: '',
        targetAmount: '',
        deadline: '',
        category: 'savings',
        description: '' // New field
    })
    const [sortConfig, setSortConfig] = useState({ key: 'deadline', direction: 'asc' })
    const [isCompactView, setIsCompactView] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedGoal, setEditedGoal] = useState(null)

    const filteredGoals = useMemo(() => {
        if (filter === 'all') return goals
        if (filter === 'completed') return goals.filter(g => g.progress >= 100)
        if (filter === 'active') return goals.filter(g => g.progress < 100)
        return goals.filter(g => g.category === filter)
    }, [goals, filter])

    const sortedGoals = useMemo(() => {
        return [...filteredGoals].sort((a, b) => {
            switch (sortConfig.key) {
                case 'deadline':
                    return sortConfig.direction === 'asc'
                        ? new Date(a.deadline) - new Date(b.deadline)
                        : new Date(b.deadline) - new Date(a.deadline)
                case 'progress':
                    return sortConfig.direction === 'asc'
                        ? a.progress - b.progress
                        : b.progress - a.progress
                case 'amount':
                    return sortConfig.direction === 'asc'
                        ? a.targetAmount - b.targetAmount
                        : b.targetAmount - a.targetAmount
                default:
                    return 0
            }
        })
    }, [filteredGoals, sortConfig])

    const getStatusColor = (goal) => {
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
        if (goal.progress >= 100) return 'emerald'
        if (daysLeft < 7) return 'red'
        if (daysLeft < 30) return 'yellow'
        return 'blue'
    }

    const getRemainingTime = (deadline) => {
        const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
        if (days < 0) return 'Overdue'
        if (days === 0) return 'Due today'
        if (days === 1) return 'Due tomorrow'
        if (days < 30) return `${days} days left`
        const months = Math.floor(days / 30)
        return `${months} month${months > 1 ? 's' : ''} left`
    }

    const handleSubmit = () => {
        if (!newGoal.name || !newGoal.targetAmount) return

        dispatch(addGoal({
            ...newGoal,
            targetAmount: Number(newGoal.targetAmount)
        }))
        setIsModalOpen(false)
        setNewGoal({
            name: '',
            targetAmount: '',
            deadline: '',
            category: 'savings',
            description: '' // New field
        })
        notify.success('Goal added successfully')
    }

    const handleEditSubmit = () => {
        if (!editedGoal.name || !editedGoal.targetAmount) return

        dispatch(updateGoal({
            ...editedGoal,
            targetAmount: Number(editedGoal.targetAmount)
        }))
        setIsEditing(false)
        setSelectedGoal(null)
        notify.success('Goal updated successfully')
    }

    const EmptyState = ({ filter }) => {
        let message = "Start by creating your first financial goal"
        if (filter === 'completed') {
            message = "No completed goals yet. Keep working towards your targets!"
        } else if (filter === 'active') {
            message = "No active goals. Time to set some new targets!"
        }

        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <FiFlag size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    No goals found
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                    {message}
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    <FiPlus size={20} />
                    Create Your First Goal
                </button>
            </div>
        )
    }

    const LayoutToggle = ({ layout, setLayout }) => (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded ${layout === 'grid' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="Grid view"
            >
                <FiGrid size={16} />
            </button>
            <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded ${layout === 'list' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="List view"
            >
                <FiList size={16} />
            </button>
            <button
                onClick={() => setLayout('table')}
                className={`p-2 rounded ${layout === 'table' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
                title="Table view"
            >
                <FiMenu size={16} />
            </button>
        </div>
    )

    const TableView = ({ goals, onSelect, onDelete }) => {
        const handleSort = (key) => {
            setSortConfig(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }))
        }

        const totalAmount = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0)
        const averageProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)

        return (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">
                                <button
                                    className="flex items-center gap-1 hover:text-slate-700"
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                                    )}
                                </button>
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">Target</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">Progress</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-500">Deadline</th>
                            <th className="text-right p-4 text-sm font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.map(goal => (
                            <tr
                                key={goal.id}
                                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                                onClick={() => onSelect(goal)}
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{goal.name}</span>
                                        {goal.progress >= 100 && <FiAward className="text-yellow-500" />}
                                    </div>
                                </td>
                                <td className="p-4">€{goal.targetAmount}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`bg-${getStatusColor(goal)}-500 h-2 rounded-full`}
                                                style={{ width: `${goal.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm">{Math.round(goal.progress)}%</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{getRemainingTime(goal.deadline)}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(goal.id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-50 font-medium">
                            <td className="p-4">Total ({goals.length} goals)</td>
                            <td className="p-4">€{totalAmount}</td>
                            <td className="p-4">{averageProgress}% avg</td>
                            <td colSpan={2} />
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const ListView = ({ goals, onSelect, onDelete }) => (
        <div className="space-y-2">
            {goals.map(goal => (
                <div
                    key={goal.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => onSelect(goal)}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full bg-${getCategoryColor(goal.category)}-100 text-${getCategoryColor(goal.category)}-700`}>
                                    {goal.category}
                                </span>
                                {goal.progress >= 100 && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                        Completed
                                    </span>
                                )}
                            </div>
                            <h3 className="font-medium text-lg mb-1">{goal.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{goal.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                                <div className="text-xs text-slate-500">Target</div>
                                <div className="font-bold text-lg">€{goal.targetAmount}</div>
                            </div>
                            <div className="w-32">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{Math.round(goal.progress)}%</span>
                                    <span className="text-slate-500">{getRemainingTime(goal.deadline)}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`bg-${getStatusColor(goal)}-500 h-2 rounded-full transition-all`}
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(goal.id)
                            }}
                            className="p-2 hover:bg-red-50 rounded-full text-red-500"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )

    // GoalForm Component
    const GoalForm = ({ goal, onChange, onSubmit, onCancel }) => (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Goal Name"
                className="w-full p-2 border rounded-lg"
                value={goal.name}
                onChange={e => onChange({ ...goal, name: e.target.value })}
            />
            <input
                type="number"
                placeholder="Target Amount"
                className="w-full p-2 border rounded-lg"
                value={goal.targetAmount}
                onChange={e => onChange({ ...goal, targetAmount: e.target.value })}
            />
            <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={goal.deadline}
                onChange={e => onChange({ ...goal, deadline: e.target.value })}
            />
            <select
                className="w-full p-2 border rounded-lg"
                value={goal.category}
                onChange={e => onChange({ ...goal, category: e.target.value })}
            >
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="debt">Debt Repayment</option>
                <option value="purchase">Major Purchase</option>
            </select>
            <textarea
                placeholder="Description"
                className="w-full p-2 border rounded-lg"
                value={goal.description}
                onChange={e => onChange({ ...goal, description: e.target.value })}
            />

            <div>
                <label className="block text-sm text-slate-600 mb-1">Progress</label>
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        className="flex-1"
                        value={goal.progress || 0}
                        onChange={e => onChange({ ...goal, progress: Number(e.target.value) })}
                    />
                    <span className="text-sm text-slate-600 w-12">{goal.progress || 0}%</span>
                </div>
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    onClick={onSubmit}
                    className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                    Save Changes
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 border px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    )

    // GoalDetails Component
    const GoalDetails = ({ goal, onProgressUpdate }) => {
        const [amount, setAmount] = useState('')
        const remainingAmount = goal.targetAmount - (goal.currentAmount || 0)
      
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Target Amount</p>
              <p className="text-2xl font-bold">€{goal.targetAmount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Amount</p>
              <p className="text-2xl font-bold">€{goal.currentAmount || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Add Progress</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full p-2 border rounded-lg"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="0"
                  max={remainingAmount}
                />
                <button
                  onClick={() => {
                    if (amount) {
                      onProgressUpdate(Number(amount))
                      setAmount('')
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  disabled={!amount || Number(amount) <= 0}
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Remaining: €{remainingAmount}
              </p>
            </div>
          </div>
        )
      }

    // Goal Details Modal Component
    const GoalDetailsModal = ({ goal, onClose, onEdit }) => {
        const dispatch = useDispatch()
        const [isEditing, setIsEditing] = useState(false)
        const [editedGoal, setEditedGoal] = useState(goal)
      
        const handleProgressUpdate = (amount) => {
          dispatch(updateGoalProgress({ id: goal.id, amount }))
          // Update local state to reflect changes
          const updatedGoal = {
            ...goal,
            currentAmount: Math.min((goal.currentAmount || 0) + amount, goal.targetAmount),
          }
          updatedGoal.progress = (updatedGoal.currentAmount / updatedGoal.targetAmount) * 100
          setSelectedGoal(updatedGoal)
          notify.success('Progress updated successfully')
        }
      
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[480px]">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold">
                  {isEditing ? 'Edit Goal' : goal.name}
                </h3>
                <div className="flex gap-2">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  )}
                  <button onClick={onClose} className="text-slate-500">×</button>
                </div>
              </div>
      
              {isEditing ? (
                <GoalForm
                  goal={editedGoal}
                  onChange={setEditedGoal}
                  onSubmit={() => {
                    onEdit(editedGoal)
                    setIsEditing(false)
                  }}
                  onCancel={() => {
                    setIsEditing(false)
                    setEditedGoal(goal)
                  }}
                />
              ) : (
                <GoalDetails 
                  goal={goal}
                  onProgressUpdate={handleProgressUpdate}
                />
              )}
            </div>
          </div>
        )
      }

    return (
        <div className="w-full">
            <div className="border-b border-b-slate-300 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-slate-700 font-semibold">Financial Goals</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 text-sm text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-800"
                    >
                        <FiPlus className="inline mr-2" /> Add Goal
                    </button>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'active' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'completed' ? 'bg-slate-900 text-white' : 'bg-slate-100'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <LayoutToggle layout={viewLayout} setLayout={setViewLayout} />
                        {viewLayout === 'grid' && (
                            <button
                                onClick={() => setIsCompactView(!isCompactView)}
                                className="p-2 rounded hover:bg-slate-100"
                                title={isCompactView ? 'Expanded view' : 'Compact view'}
                            >
                                {isCompactView ? <FiMaximize size={16} /> : <FiMinimize size={16} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                {sortedGoals.length > 0 ? (
                    <>
                        {viewLayout === 'grid' && (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {sortedGoals.map(goal => (
                                    <div
                                        key={goal.id}
                                        className="bg-white rounded-xl border border-slate-300 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => setSelectedGoal(goal)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-800">{goal.name}</h3>
                                                    {goal.progress >= 100 && (
                                                        <FiAward className="text-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500">Target: €{goal.targetAmount}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(deleteGoal(goal.id));
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>

                                        <div className="mb-2">
                                            <div className="flex justify-between text-sm text-slate-600 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round(goal.progress)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className={`bg-${getStatusColor(goal)}-500 h-2 rounded-full transition-all`}
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <FiClock size={14} />
                                            <span>{getRemainingTime(goal.deadline)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {viewLayout === 'list' && (
                            <ListView
                                goals={sortedGoals}
                                onSelect={setSelectedGoal}
                                onDelete={(id) => dispatch(deleteGoal(id))}
                            />
                        )}
                        {viewLayout === 'table' && (
                            <TableView
                                goals={sortedGoals}
                                onSelect={setSelectedGoal}
                                onDelete={(id) => dispatch(deleteGoal(id))}
                            />
                        )}
                    </>
                ) : (
                    <EmptyState filter={filter} />
                )}
            </div>

            {/* Goal Details Modal */}
            {selectedGoal && (
                <GoalDetailsModal
                    goal={selectedGoal}
                    onClose={() => setSelectedGoal(null)}
                    onEdit={(updatedGoal) => {
                        dispatch(updateGoal(updatedGoal))
                        setSelectedGoal(updatedGoal)
                        notify.success('Goal updated successfully')
                    }}
                />
            )}

            {/* Add Goal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-6">Add New Goal</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Goal Name"
                                className="w-full p-2 border rounded-lg"
                                value={newGoal.name}
                                onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Target Amount"
                                className="w-full p-2 border rounded-lg"
                                value={newGoal.targetAmount}
                                onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                            />
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={newGoal.deadline}
                                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                            />
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={newGoal.category}
                                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                            >
                                <option value="savings">Savings</option>
                                <option value="investment">Investment</option>
                                <option value="debt">Debt Repayment</option>
                                <option value="purchase">Major Purchase</option>
                            </select>
                            <textarea
                                placeholder="Description"
                                className="w-full p-2 border rounded-lg"
                                value={newGoal.description}
                                onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                            />

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                                >
                                    Add Goal
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border px-4 py-2 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Goals
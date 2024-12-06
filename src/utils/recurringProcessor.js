// src/utils/recurringProcessor.js
export const processRecurringItems = (items, dispatch) => {
    const today = new Date()
    
    items.forEach(item => {
      if (!item.isActive) return
      
      const nextDue = new Date(item.nextDue)
      if (nextDue <= today) {
        // Add transaction
        dispatch(addTransaction({
          description: item.description,
          amount: Number(item.amount),
          type: item.type
        }))
        
        // Calculate next due date
        const newDate = new Date(nextDue)
        switch(item.frequency) {
          case 'weekly':
            newDate.setDate(newDate.getDate() + 7)
            break
          case 'monthly':
            newDate.setMonth(newDate.getMonth() + 1)
            break
          case 'yearly':
            newDate.setFullYear(newDate.getFullYear() + 1)
            break
        }
        
        dispatch(updateNextDue({
          id: item.id, 
          nextDue: newDate.toISOString()
        }))
      }
    })
  }
  
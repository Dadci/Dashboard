
export const processGoalProgress = (goals, transactions) => {
    goals.forEach(goal => {
        const relevantTransactions = transactions.filter(t =>
            t.category === goal.category &&
            new Date(t.createdAt) >= new Date(goal.createdAt)
        )

        const currentAmount = relevantTransactions.reduce((sum, t) => sum + t.amount, 0)
        store.dispatch(updateGoalProgress({ id: goal.id, currentAmount }))
    })
}
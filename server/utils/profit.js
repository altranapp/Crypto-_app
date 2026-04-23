import Transaction from "../models/Transaction.js";

export async function applyProfit(user) {
  const now = new Date();
  const last = new Date(user.lastProfitTime);

  const hours = (now - last) / (1000 * 60 * 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);

    for (let i = 0; i < days; i++) {
      const profit = user.balance * user.dailyProfitRate;

      user.balance += profit;

      await Transaction.create({
        userId: user._id,
        type: "profit",
        amount: profit,
        status: "approved"
      });
    }

    user.lastProfitTime = now;
    await user.save();
  }
}

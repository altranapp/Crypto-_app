import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    axios.get('http://localhost:5000/api/user/balance/' + id)
      .then(res => setBalance(res.data.balance));
  }, []);

  return <h1>Balance: ${balance}</h1>;
}

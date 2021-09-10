import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import { getTransactionsForBuyer, getTransactionsForSeller } from '../firebase/collections';
import { formatPrice, formatDate } from '../utils/formatters';
import './Transactions.css';

function TransactionsPage() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('buying');

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = tab === 'buying'
      ? getTransactionsForBuyer(user.uid, 50)
      : getTransactionsForSeller(user.uid, 50);
    q.get()
      .then((snap) => {
        setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .finally(() => setLoading(false));
  }, [user?.uid, tab]);

  if (!user) {
    return (
      <Layout>
        <div className="transactionsPage">
          <p>Please log in to view your transactions.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="transactionsPage">
        <h1>My transactions</h1>
        <div className="transactionsTabs">
          <button
            type="button"
            className={tab === 'buying' ? 'active' : ''}
            onClick={() => setTab('buying')}
          >
            Buying
          </button>
          <button
            type="button"
            className={tab === 'selling' ? 'active' : ''}
            onClick={() => setTab('selling')}
          >
            Selling
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="transactionsEmpty">No transactions yet.</p>
        ) : (
          <ul className="transactionsList">
            {transactions.map((t) => (
              <li key={t.id} className="transactionsItem">
                <div className="transactionsItemImage">
                  {t.productImage ? (
                    <img src={t.productImage} alt="" />
                  ) : (
                    <span>Ad</span>
                  )}
                </div>
                <div className="transactionsItemBody">
                  <Link to={`/ad/${t.productId}`} className="transactionsItemTitle">
                    {t.productName}
                  </Link>
                  <p className="transactionsItemMeta">
                    {tab === 'buying' ? `Seller: ${t.sellerName}` : `Buyer: ${t.buyerName}`}
                  </p>
                  <p className="transactionsItemAmount">{formatPrice(t.amount)}</p>
                  <span className={`transactionsItemStatus transactionsItemStatus--${t.status}`}>
                    {t.status}
                  </span>
                  {t.createdAt?.toDate && (
                    <span className="transactionsItemDate">
                      {formatDate(t.createdAt.toDate())}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default TransactionsPage;

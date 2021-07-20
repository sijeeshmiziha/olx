import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AllPostContext } from '../contextStore/AllPostContext';
import { PostContext } from '../contextStore/PostContext';
import { Firebase } from '../firebase/config';

/**
 * Debounce helper – returns a debounced version of the callback.
 */
function useDebouncedCallback(fn, delay) {
  const timer = useRef(null);
  const stable = useRef(fn);
  stable.current = fn;

  return useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => stable.current(...args), delay);
    },
    [delay]
  );
}

/**
 * Read the current ?q= search param from the URL.
 */
function getQueryFromUrl(search) {
  const params = new URLSearchParams(search);
  return params.get('q') || '';
}

export function useSearchFilter(options = {}) {
  const { filterByCategory = false } = options;
  const { allPost, setAllPost } = useContext(AllPostContext);
  const { setPostContent } = useContext(PostContext);
  const history = useHistory();
  const location = useLocation();

  // Initialise wordEntered from the URL ?q= param so it survives remounts
  const [wordEntered, setWordEntered] = useState(() => getQueryFromUrl(location.search));
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Keep wordEntered in sync whenever the URL ?q= param changes
  // (e.g. user clicks a recent-search link, voice search, or navigates)
  useEffect(() => {
    const urlQuery = getQueryFromUrl(location.search);
    setWordEntered(urlQuery);
    // Close dropdown when the route changes
    setFilteredData([]);
    setIsOpen(false);
  }, [location.search]);

  // If AllPostContext is empty, fetch products so autocomplete works on every page
  useEffect(() => {
    if (allPost && allPost.length > 0) return;
    Firebase.firestore()
      .collection('products')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get()
      .then((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllPost(list);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced filter logic
  const runFilter = useDebouncedCallback((searchWord) => {
    if (!searchWord.trim()) {
      setFilteredData([]);
      setIsOpen(false);
      return;
    }
    const lower = searchWord.toLowerCase();
    const newFilter = (allPost || []).filter((value) => {
      const matchName = (value?.name ?? '').toLowerCase().includes(lower);
      const matchCategory =
        filterByCategory &&
        (value?.category ?? '').toLowerCase().includes(lower);
      return matchName || matchCategory;
    });
    setFilteredData(newFilter);
    setIsOpen(newFilter.length > 0);
  }, 200);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    runFilter(searchWord);
  };

  const closeDropdown = () => {
    setFilteredData([]);
    setIsOpen(false);
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered('');
    setIsOpen(false);
  };

  const handleSelectedSearch = (item) => {
    setPostContent(item);
    setFilteredData([]);
    setIsOpen(false);
    history.push(item?.id ? `/ad/${item.id}` : '/view');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFilteredData([]);
    }
  };

  return {
    filteredData,
    wordEntered,
    isOpen,
    wrapperRef,
    handleFilter,
    clearInput,
    closeDropdown,
    handleSelectedSearch,
    handleKeyDown,
    setIsOpen,
  };
}
